/** India Standard Time (no DST). */
export const IST = 'Asia/Kolkata';

export function ordinalDay(n) {
  const v = Math.abs(n) % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (Math.abs(n) % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

/** Y-M-D for the IST calendar day containing instant `at`. */
export function istYmd(at = new Date()) {
  const s = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(at);
  const [y, m, d] = s.split('-').map(Number);
  return { y, m, d };
}

/** Noon IST on the given calendar day (stable for +/- day math). */
export function istDateFromParts(y, m, d) {
  return new Date(
    `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T12:00:00+05:30`,
  );
}

export function istAddCalendarDays(ymd, delta) {
  const t = istDateFromParts(ymd.y, ymd.m, ymd.d);
  return istYmd(new Date(t.getTime() + delta * 86400000));
}

/** `YYYY-MM-DD` for `<input type="date" />` (calendar date interpreted as IST). */
export function ymdToHtmlDateValue(ymd) {
  if (!ymd || !Number.isFinite(ymd.y)) return '';
  return `${ymd.y}-${String(ymd.m).padStart(2, '0')}-${String(ymd.d).padStart(2, '0')}`;
}

/** Parse `YYYY-MM-DD` from a date input into IST calendar parts. */
export function ymdFromHtmlDateValue(s) {
  if (!s || typeof s !== 'string') return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, m: mo, d };
}

/** Inclusive 30-day range label in IST (start … start+29). */
export function formatHeatmap30DayWindowLabel(startYmd) {
  if (!startYmd) return '';
  const endYmd = istAddCalendarDays(startYmd, 29);
  return `${formatTrendDayLabelIST(istDateFromParts(startYmd.y, startYmd.m, startYmd.d))} – ${formatTrendDayLabelIST(istDateFromParts(endYmd.y, endYmd.m, endYmd.d))}`;
}

function daysInMonth(y, month1to12) {
  return new Date(y, month1to12, 0).getDate();
}

/** e.g. "5th May 2026" for a given instant (IST calendar day). */
export function formatTrendDayLabelIST(at = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).formatToParts(at);
  const day = Number(parts.find(p => p.type === 'day')?.value);
  const month = parts.find(p => p.type === 'month')?.value;
  const year = parts.find(p => p.type === 'year')?.value;
  if (!Number.isFinite(day) || !month || !year) return '';
  return `${ordinalDay(day)} ${month} ${year}`;
}

function monthShortForYmd(ymd) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    month: 'short',
  }).formatToParts(istDateFromParts(ymd.y, ymd.m, ymd.d));
  return parts.find(p => p.type === 'month')?.value ?? '';
}

/**
 * Tab bar date badge: single day or range in IST, year once at the end when possible.
 * Week = today through today + 7 days (inclusive span per product copy).
 */
export function formatDateFilterRangeLabel(activeTime, at = new Date()) {
  const today = istYmd(at);

  if (activeTime === 'Today') {
    return formatTrendDayLabelIST(istDateFromParts(today.y, today.m, today.d));
  }

  if (activeTime === 'Week') {
    const end = istAddCalendarDays(today, 7);
    return formatIstRangeBadge(today, end);
  }

  if (activeTime === 'Month') {
    const start = { y: today.y, m: today.m, d: 1 };
    const end = { y: today.y, m: today.m, d: daysInMonth(today.y, today.m) };
    return formatIstRangeBadge(start, end);
  }

  return formatTrendDayLabelIST(istDateFromParts(today.y, today.m, today.d));
}

function formatIstRangeBadge(start, end) {
  if (start.y !== end.y) {
    return `${formatTrendDayLabelIST(istDateFromParts(start.y, start.m, start.d))} – ${formatTrendDayLabelIST(istDateFromParts(end.y, end.m, end.d))}`;
  }
  const y = end.y;
  const ma = monthShortForYmd(start);
  const mb = monthShortForYmd(end);
  if (start.m === end.m) {
    return `${ordinalDay(start.d)} ${ma} – ${ordinalDay(end.d)} ${mb} ${y}`;
  }
  return `${ordinalDay(start.d)} ${ma} – ${ordinalDay(end.d)} ${mb} ${y}`;
}
