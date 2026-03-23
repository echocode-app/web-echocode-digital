import { Timestamp } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/server/firebase/firestore';

export type OverviewStatsKind =
  | 'client_submissions'
  | 'email_submissions'
  | 'vacancy_submissions'
  | 'echocode_app_submissions';

export type OverviewStatus = 'new' | 'viewed' | 'processed' | 'rejected' | 'deferred';

export interface OverviewStatusCounts {
  new: number;
  viewed: number;
  processed: number;
  rejected: number;
  deferred: number;
}

export interface OverviewStatusesByMonthPoint extends OverviewStatusCounts {
  month: string;
}

export interface OverviewStatsSnapshot {
  totals: {
    allTime: number;
    currentMonth: number;
  };
  byStatus: OverviewStatusCounts;
  statusesByMonth: OverviewStatusesByMonthPoint[];
}

const OVERVIEW_STATS_COLLECTION = '_internal_admin_overview_stats';

function emptyStatusCounts(): OverviewStatusCounts {
  return {
    new: 0,
    viewed: 0,
    processed: 0,
    rejected: 0,
    deferred: 0,
  };
}

function emptyStatusesByMonth(): OverviewStatusesByMonthPoint[] {
  return Array.from({ length: 12 }, (_, monthIndex) => ({
    month: String(monthIndex + 1).padStart(2, '0'),
    ...emptyStatusCounts(),
  }));
}

function currentMonthKey(now: Date): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

function createEmptyDoc(now: Date) {
  return {
    version: 1,
    year: now.getUTCFullYear(),
    currentMonthKey: currentMonthKey(now),
    totals: {
      allTime: 0,
      currentMonth: 0,
    },
    byStatus: emptyStatusCounts(),
    statusesByMonth: emptyStatusesByMonth(),
    updatedAt: Timestamp.now(),
  };
}

function normalizeDoc(
  raw: Record<string, unknown> | undefined,
  now: Date,
): ReturnType<typeof createEmptyDoc> {
  const base = createEmptyDoc(now);
  if (!raw) {
    return base;
  }

  const year = typeof raw.year === 'number' ? raw.year : base.year;
  const rawTotals =
    typeof raw.totals === 'object' && raw.totals ? (raw.totals as Record<string, unknown>) : {};
  const rawByStatus =
    typeof raw.byStatus === 'object' && raw.byStatus
      ? (raw.byStatus as Record<string, unknown>)
      : {};
  const rawStatusesByMonth = Array.isArray(raw.statusesByMonth) ? raw.statusesByMonth : [];

  const statusesByMonth = emptyStatusesByMonth().map((fallbackPoint) => {
    const rawPoint = rawStatusesByMonth.find(
      (candidate) =>
        candidate &&
        typeof candidate === 'object' &&
        (candidate as Record<string, unknown>).month === fallbackPoint.month,
    ) as Record<string, unknown> | undefined;

    return {
      month: fallbackPoint.month,
      new: typeof rawPoint?.new === 'number' ? rawPoint.new : fallbackPoint.new,
      viewed: typeof rawPoint?.viewed === 'number' ? rawPoint.viewed : fallbackPoint.viewed,
      processed:
        typeof rawPoint?.processed === 'number' ? rawPoint.processed : fallbackPoint.processed,
      rejected: typeof rawPoint?.rejected === 'number' ? rawPoint.rejected : fallbackPoint.rejected,
      deferred: typeof rawPoint?.deferred === 'number' ? rawPoint.deferred : fallbackPoint.deferred,
    };
  });

  const doc = {
    ...base,
    year,
    totals: {
      allTime: typeof rawTotals.allTime === 'number' ? rawTotals.allTime : base.totals.allTime,
      currentMonth:
        typeof rawTotals.currentMonth === 'number'
          ? rawTotals.currentMonth
          : base.totals.currentMonth,
    },
    byStatus: {
      new: typeof rawByStatus.new === 'number' ? rawByStatus.new : base.byStatus.new,
      viewed: typeof rawByStatus.viewed === 'number' ? rawByStatus.viewed : base.byStatus.viewed,
      processed:
        typeof rawByStatus.processed === 'number' ? rawByStatus.processed : base.byStatus.processed,
      rejected:
        typeof rawByStatus.rejected === 'number' ? rawByStatus.rejected : base.byStatus.rejected,
      deferred:
        typeof rawByStatus.deferred === 'number' ? rawByStatus.deferred : base.byStatus.deferred,
    },
    statusesByMonth,
  };

  if (doc.year !== now.getUTCFullYear()) {
    doc.year = now.getUTCFullYear();
    doc.statusesByMonth = emptyStatusesByMonth();
  }

  const monthKey = currentMonthKey(now);
  if (raw.currentMonthKey !== monthKey) {
    doc.totals.currentMonth = 0;
    const currentMonthPoint = doc.statusesByMonth[now.getUTCMonth()];
    if (currentMonthPoint) {
      doc.totals.currentMonth =
        currentMonthPoint.new +
        currentMonthPoint.viewed +
        currentMonthPoint.processed +
        currentMonthPoint.rejected +
        currentMonthPoint.deferred;
    }
  }

  return {
    ...doc,
    currentMonthKey: monthKey,
    updatedAt: Timestamp.now(),
  };
}

function adjustMonthPoint(
  points: OverviewStatusesByMonthPoint[],
  createdAt: Date,
  status: OverviewStatus,
  delta: 1 | -1,
  year: number,
) {
  if (createdAt.getUTCFullYear() !== year) {
    return;
  }

  const monthIndex = createdAt.getUTCMonth();
  const point = points[monthIndex];
  if (!point) {
    return;
  }

  point[status] = Math.max(0, point[status] + delta);
}

export async function getOverviewStats(
  kind: OverviewStatsKind,
): Promise<OverviewStatsSnapshot | null> {
  const snapshot = await getFirestoreDb().collection(OVERVIEW_STATS_COLLECTION).doc(kind).get();
  if (!snapshot.exists) {
    return null;
  }

  const normalized = normalizeDoc(
    snapshot.data() as Record<string, unknown> | undefined,
    new Date(),
  );

  return {
    totals: normalized.totals,
    byStatus: normalized.byStatus,
    statusesByMonth: normalized.statusesByMonth,
  };
}

export async function replaceOverviewStats(
  kind: OverviewStatsKind,
  snapshot: OverviewStatsSnapshot,
): Promise<void> {
  const now = new Date();
  const payload = {
    version: 1,
    year: now.getUTCFullYear(),
    currentMonthKey: currentMonthKey(now),
    totals: snapshot.totals,
    byStatus: snapshot.byStatus,
    statusesByMonth: snapshot.statusesByMonth,
    updatedAt: Timestamp.now(),
  };

  await getFirestoreDb().collection(OVERVIEW_STATS_COLLECTION).doc(kind).set(payload, {
    merge: true,
  });
}

export async function recordOverviewCreated(input: {
  kind: OverviewStatsKind;
  createdAt: Date;
  status: OverviewStatus;
}): Promise<void> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(OVERVIEW_STATS_COLLECTION).doc(input.kind);

  await firestore.runTransaction(async (tx) => {
    const now = new Date();
    const snapshot = await tx.get(docRef);
    const doc = normalizeDoc(snapshot.data() as Record<string, unknown> | undefined, now);

    doc.totals.allTime += 1;
    doc.byStatus[input.status] += 1;

    if (currentMonthKey(input.createdAt) === doc.currentMonthKey) {
      doc.totals.currentMonth += 1;
    }

    adjustMonthPoint(doc.statusesByMonth, input.createdAt, input.status, 1, doc.year);
    tx.set(docRef, doc, { merge: true });
  });
}

export async function recordOverviewStatusChanged(input: {
  kind: OverviewStatsKind;
  createdAt: Date;
  previousStatus: OverviewStatus;
  nextStatus: OverviewStatus;
}): Promise<void> {
  if (input.previousStatus === input.nextStatus) {
    return;
  }

  const firestore = getFirestoreDb();
  const docRef = firestore.collection(OVERVIEW_STATS_COLLECTION).doc(input.kind);

  await firestore.runTransaction(async (tx) => {
    const snapshot = await tx.get(docRef);
    const doc = normalizeDoc(snapshot.data() as Record<string, unknown> | undefined, new Date());

    doc.byStatus[input.previousStatus] = Math.max(0, doc.byStatus[input.previousStatus] - 1);
    doc.byStatus[input.nextStatus] += 1;

    adjustMonthPoint(doc.statusesByMonth, input.createdAt, input.previousStatus, -1, doc.year);
    adjustMonthPoint(doc.statusesByMonth, input.createdAt, input.nextStatus, 1, doc.year);

    tx.set(docRef, doc, { merge: true });
  });
}

export async function recordOverviewDeleted(input: {
  kind: OverviewStatsKind;
  createdAt: Date;
  status: OverviewStatus;
}): Promise<void> {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection(OVERVIEW_STATS_COLLECTION).doc(input.kind);

  await firestore.runTransaction(async (tx) => {
    const snapshot = await tx.get(docRef);
    const doc = normalizeDoc(snapshot.data() as Record<string, unknown> | undefined, new Date());

    doc.totals.allTime = Math.max(0, doc.totals.allTime - 1);
    doc.byStatus[input.status] = Math.max(0, doc.byStatus[input.status] - 1);

    if (currentMonthKey(input.createdAt) === doc.currentMonthKey) {
      doc.totals.currentMonth = Math.max(0, doc.totals.currentMonth - 1);
    }

    adjustMonthPoint(doc.statusesByMonth, input.createdAt, input.status, -1, doc.year);
    tx.set(docRef, doc, { merge: true });
  });
}
