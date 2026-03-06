'use client';

import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import { EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS } from '@/shared/admin/constants';
import { formatDateTime } from '@/components/admin/client-submissions/shared/clientSubmissions.formatters';
import { useVacancyCandidatesOverview } from './useVacancyCandidatesOverview';

function MetricTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-(--radius-secondary) border border-gray16 bg-black/20 px-3 py-2">
      <p className="font-main text-main-xs uppercase tracking-[0.12em] text-gray60">{label}</p>
      <p className="mt-1 font-title text-title-sm text-white">{value}</p>
    </div>
  );
}

export default function VacancyCandidatesSummary() {
  const { state, overview } = useVacancyCandidatesOverview();

  const values = overview ?? {
    totals: { currentMonth: 0, allTime: 0 },
    byStatus: { ...EMPTY_CLIENT_SUBMISSION_STATUS_COUNTS },
    statusesByMonth: [],
    byVacancy: [],
  };

  return (
    <section className="space-y-4">
      <article className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-main text-title-xs uppercase tracking-[0.14em] text-gray60">Candidates queue</h2>
          </div>
          <InfoTooltip
            label="Vacancy candidates workflow info"
            text="Candidate submissions support status updates, comments, and vacancy-based filtering from this page."
          />
        </div>
      </article>

      <article className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4">
        <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-7">
          <MetricTile label="Month total" value={values.totals.currentMonth} />
          <MetricTile label="All-time total" value={values.totals.allTime} />
          <MetricTile label="New" value={values.byStatus.new} />
          <MetricTile label="Viewed" value={values.byStatus.viewed} />
          <MetricTile label="Processed" value={values.byStatus.processed} />
          <MetricTile label="Rejected" value={values.byStatus.rejected} />
          <MetricTile label="Deferred" value={values.byStatus.deferred} />
        </div>
        {state === 'error' ? (
          <p className="mt-2 font-main text-main-xs text-[#ff6d7a]">Unable to load summary metrics.</p>
        ) : null}
      </article>

      <article className="rounded-(--radius-base) border border-gray16 bg-base-gray p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-main text-title-xs uppercase tracking-[0.14em] text-gray60">Vacancy grouping</h2>
          </div>
          <InfoTooltip
            label="Vacancy grouping info"
            text="Each group is built from the stored vacancy snapshot inside the submission, not from live vacancy page data."
          />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {values.byVacancy.length > 0 ? values.byVacancy.map((group) => {
            const latest = group.latestSubmissionAt ? formatDateTime(group.latestSubmissionAt) : null;

            return (
              <div key={group.vacancyKey} className="rounded-(--radius-secondary) border border-gray16 bg-black/20 p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-title text-title-xs text-white">{group.vacancy.vacancyTitle || group.vacancyKey}</p>
                    <p className="mt-1 font-main text-main-xs text-gray60">{group.vacancy.level || 'Level not specified'} · {group.vacancy.employmentType || 'Employment not specified'}</p>
                  </div>
                  <span className="rounded-(--radius-secondary) border border-[#ffd38e] bg-[linear-gradient(90deg,#fff3cf,#ffe9f2)] px-2 py-1 font-main text-main-xs text-black/80">
                    {group.submissionsTotal} total
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 font-main text-main-xs text-gray75">
                  <span className="rounded-(--radius-secondary) border border-gray16 px-2 py-1">New: {group.newCount}</span>
                  <span className="rounded-(--radius-secondary) border border-gray16 px-2 py-1">Key: {group.vacancyKey}</span>
                  {latest ? <span className="rounded-(--radius-secondary) border border-gray16 px-2 py-1">Latest: {latest.date} {latest.time}</span> : null}
                </div>
              </div>
            );
          }) : (
            <p className="font-main text-main-sm text-gray75">No candidate submissions grouped by vacancy yet.</p>
          )}
        </div>
      </article>
    </section>
  );
}
