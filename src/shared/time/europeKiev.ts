export const ADMIN_TIME_ZONE = 'Europe/Kiev';

function getFormatter(timeZone: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hourCycle: 'h23',
    ...options,
  });
}

export function getAdminDateParts(date: Date): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  return getTimeZoneParts(date, ADMIN_TIME_ZONE);
}

function getTimeZoneParts(
  date: Date,
  timeZone = ADMIN_TIME_ZONE,
): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const formatter = getFormatter(timeZone, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes): number => {
    const value = parts.find((part) => part.type === type)?.value;
    return value ? Number(value) : 0;
  };

  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour'),
    minute: read('minute'),
    second: read('second'),
  };
}

function getTimeZoneOffsetMinutes(date: Date, timeZone = ADMIN_TIME_ZONE): number {
  const formatter = getFormatter(timeZone, {
    timeZoneName: 'shortOffset',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const offsetValue =
    formatter.formatToParts(date).find((part) => part.type === 'timeZoneName')?.value ?? 'GMT';

  const normalized = offsetValue.replace('UTC', 'GMT');
  const match = normalized.match(/^GMT(?:([+-])(\d{1,2})(?::?(\d{2}))?)?$/);
  if (!match || !match[1] || !match[2]) {
    return 0;
  }

  const sign = match[1] === '-' ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? '0');
  return sign * (hours * 60 + minutes);
}

function zonedDateTimeToUtc(
  input: {
    year: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
    second?: number;
    millisecond?: number;
  },
  timeZone = ADMIN_TIME_ZONE,
): Date {
  let utcMillis = Date.UTC(
    input.year,
    input.month - 1,
    input.day,
    input.hour ?? 0,
    input.minute ?? 0,
    input.second ?? 0,
    input.millisecond ?? 0,
  );

  for (let index = 0; index < 3; index += 1) {
    const offsetMinutes = getTimeZoneOffsetMinutes(new Date(utcMillis), timeZone);
    const adjusted =
      Date.UTC(
        input.year,
        input.month - 1,
        input.day,
        input.hour ?? 0,
        input.minute ?? 0,
        input.second ?? 0,
        input.millisecond ?? 0,
      ) -
      offsetMinutes * 60 * 1000;

    if (adjusted === utcMillis) {
      break;
    }

    utcMillis = adjusted;
  }

  return new Date(utcMillis);
}

export function startOfAdminDay(input: Date): Date {
  const parts = getAdminDateParts(input);
  return zonedDateTimeToUtc(
    {
      year: parts.year,
      month: parts.month,
      day: parts.day,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    },
    ADMIN_TIME_ZONE,
  );
}

export function startOfAdminMonth(input: Date): Date {
  const parts = getAdminDateParts(input);
  return zonedDateTimeToUtc(
    {
      year: parts.year,
      month: parts.month,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    },
    ADMIN_TIME_ZONE,
  );
}

export function startOfAdminYear(input: Date): Date {
  const parts = getAdminDateParts(input);
  return zonedDateTimeToUtc(
    {
      year: parts.year,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    },
    ADMIN_TIME_ZONE,
  );
}

export function getAdminWeekday(input: Date): number {
  const parts = getAdminDateParts(input);
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12, 0, 0, 0)).getUTCDay();
}

export function startOfAdminWeek(input: Date): Date {
  const weekday = getAdminWeekday(input);
  const dayOffset = (weekday + 6) % 7;
  const parts = getAdminDateParts(input);

  return zonedDateTimeToUtc(
    {
      year: parts.year,
      month: parts.month,
      day: parts.day - dayOffset,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    },
    ADMIN_TIME_ZONE,
  );
}

export function getAdminDaysInMonth(input: Date): number {
  const parts = getAdminDateParts(input);
  return new Date(Date.UTC(parts.year, parts.month, 0, 12, 0, 0, 0)).getUTCDate();
}

export function addAdminDays(input: Date, days: number): Date {
  const parts = getTimeZoneParts(input, ADMIN_TIME_ZONE);
  return zonedDateTimeToUtc(
    {
      year: parts.year,
      month: parts.month,
      day: parts.day + days,
      hour: parts.hour,
      minute: parts.minute,
      second: parts.second,
      millisecond: 0,
    },
    ADMIN_TIME_ZONE,
  );
}

export function getAdminYearMonthRanges(
  todayStart: Date,
): Array<{ month: string; range: { start: Date; end: Date } }> {
  const parts = getTimeZoneParts(todayStart, ADMIN_TIME_ZONE);

  return Array.from({ length: 12 }, (_, monthIndex) => {
    const month = monthIndex + 1;
    const start = zonedDateTimeToUtc({ year: parts.year, month, day: 1 }, ADMIN_TIME_ZONE);
    const end =
      month === 12
        ? zonedDateTimeToUtc({ year: parts.year + 1, month: 1, day: 1 }, ADMIN_TIME_ZONE)
        : zonedDateTimeToUtc({ year: parts.year, month: month + 1, day: 1 }, ADMIN_TIME_ZONE);

    return {
      month: String(month).padStart(2, '0'),
      range: { start, end },
    };
  });
}

export function getAdminDateIso(value: Date | string | number): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const parts = getTimeZoneParts(date, ADMIN_TIME_ZONE);
  return `${String(parts.year).padStart(4, '0')}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

export function getAdminTimeIso(value: Date | string | number): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  const parts = getTimeZoneParts(date, ADMIN_TIME_ZONE);
  return `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`;
}

export function getAdminDateTimeLabel(value: Date | string | number): {
  date: string;
  time: string;
} {
  return {
    date: getAdminDateIso(value),
    time: getAdminTimeIso(value),
  };
}

export function getTodayIsoInAdminTimeZone(): string {
  return getAdminDateIso(new Date());
}

export function formatAdminDateTime(value: Date | string | number): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const formatter = getFormatter(ADMIN_TIME_ZONE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return formatter.format(date).replace(',', '');
}
