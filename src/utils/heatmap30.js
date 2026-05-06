import { mulberry32 } from './seededRandom';
import {
  istAddCalendarDays,
  istDateFromParts,
} from './istDates';

/** Bottom/top axis labels (calendar reference style). */
export const HEATMAP_CAL_COL_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const HOURS = [
  '6am', '7am', '8am', '9am', '10am', '11am', '12pm',
  '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm',
];

function istIsWeekend(ymd) {
  const wd = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
  }).format(istDateFromParts(ymd.y, ymd.m, ymd.d));
  return wd === 'Sat' || wd === 'Sun';
}

function istWeekdayShortUpper(ymd) {
  const s = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
  }).format(istDateFromParts(ymd.y, ymd.m, ymd.d));
  return String(s || 'SUN').slice(0, 3).toUpperCase();
}

/** Days since `start` → `end` (IST calendar, signed). */
function istDayDistance(startYmd, endYmd) {
  const ta = istDateFromParts(startYmd.y, startYmd.m, startYmd.d).getTime();
  const tb = istDateFromParts(endYmd.y, endYmd.m, endYmd.d).getTime();
  return Math.round((tb - ta) / 86400000);
}

/** Columns Sun=0 … Sat=6 matching grid. */
function istWeekdaySun0Column(ymd) {
  const s = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
  }).format(istDateFromParts(ymd.y, ymd.m, ymd.d));
  const ix = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(s);
  return ix >= 0 ? ix : 0;
}

/** Sunday IST on/before startYmd (first column of calendar row). */
function gridSundayBeforeOrEqual(startYmd) {
  const dow = istWeekdaySun0Column(startYmd);
  return istAddCalendarDays(startYmd, -dow);
}

function paddedDay(d) {
  return String(d).padStart(2, '0');
}

function rowLeftDdMmm(ymd) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
  }).formatToParts(istDateFromParts(ymd.y, ymd.m, ymd.d));
  const mo = parts.find(p => p.type === 'month')?.value;
  if (!mo) return paddedDay(ymd.d);
  return `${paddedDay(ymd.d)} ${mo}`;
}

function tooltipHeader(ymd) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).formatToParts(istDateFromParts(ymd.y, ymd.m, ymd.d));
  const day = parts.find(p => p.type === 'day')?.value;
  const mon = parts.find(p => p.type === 'month')?.value;
  const year = parts.find(p => p.type === 'year')?.value;
  const wd = istWeekdayShortUpper(ymd);
  if (!day || !mon || !year) return '';
  return `${day} ${mon} ${year} (${wd})`;
}

function computeDailyAvgForYmd(ymd, baseSeed, segmentIndex) {
  const rnd = mulberry32((baseSeed + segmentIndex * 0x51ed) >>> 0);
  const weekend = istIsWeekend(ymd);
  let sum = 0;
  let count = 0;
  HOURS.forEach(hourLabel => {
    const h = parseInt(hourLabel, 10);
    let val = 0;
    if (!weekend) {
      if (h >= 9 && h <= 11) val = rnd() * 0.4 + 0.6;
      else if (h >= 12 && h <= 14) val = rnd() * 0.3 + 0.5;
      else if (h >= 8 && h <= 15) val = rnd() * 0.3 + 0.2;
      else val = rnd() * 0.1;
    } else {
      val = rnd() * 0.15;
    }
    sum += val;
    count += 1;
  });
  return count > 0 ? sum / count : 0;
}

/**
 * Calendar-style grid: rows = weeks (Sun–Sat), 30 consecutive IST days from startYmd.
 * Leading/trailing cells outside the 30-day window are empty.
 */
export function buildHeatmapCalendarGridModel(startYmd) {
  const gridSunday = gridSundayBeforeOrEqual(startYmd);
  const leading = istDayDistance(gridSunday, startYmd);
  const totalSpan = leading + 30;
  const numRows = Math.ceil(totalSpan / 7);

  const baseSeed = ((startYmd.y * 366 + startYmd.m * 31 + startYmd.d) ^ 0x6d2b79f5) >>> 0;

  const rowLeftLabels = [];
  for (let r = 0; r < numRows; r++) {
    const sunYmd = istAddCalendarDays(gridSunday, r * 7);
    rowLeftLabels.push(rowLeftDdMmm(sunYmd));
  }

  const grid = [];
  for (let r = 0; r < numRows; r++) {
    const row = [];
    for (let c = 0; c < 7; c++) {
      const flat = r * 7 + c;
      const cellYmd = istAddCalendarDays(gridSunday, flat);
      const seg = flat - leading;

      if (seg < 0 || seg >= 30) {
        row.push({
          key: `empty-${r}-${c}`,
          empty: true,
        });
        continue;
      }

      const avg = computeDailyAvgForYmd(cellYmd, baseSeed, seg);
      const score0to10 = Math.min(10, Math.max(0, Math.round(avg * 10)));
      const h1 = tooltipHeader(cellYmd);
      const h2 =
        score0to10 === 0
          ? 'No peak occupancy (mock)'
          : `Relative occupancy index: ${score0to10} (mock)`;

      row.push({
        key: `${cellYmd.y}-${String(cellYmd.m).padStart(2, '0')}-${String(cellYmd.d).padStart(2, '0')}`,
        empty: false,
        dayPadded: paddedDay(cellYmd.d),
        rawAvg: parseFloat(avg.toFixed(4)),
        score0to10,
        tooltipLine1: h1,
        tooltipLine2: h2,
      });
    }
    grid.push(row);
  }

  return { numRows, rowLeftLabels, grid, colLabels: HEATMAP_CAL_COL_LABELS };
}

/** Same stepped blue scale as the original hourly heatmap (0–1 relative intensity). */
const HEATMAP_BLUE_DARK = ['#1e3a5f', '#1e4d8c', '#1a5bb5', '#1565c0', '#1976d2', '#1e88e5'];
const HEATMAP_BLUE_LIGHT = ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb'];

export function heatmapCellFillColor01(val01, empty, isDark) {
  if (empty) return isDark ? '#21253a' : '#f0f2f8';
  const v = Number.isFinite(val01) ? Math.min(1, Math.max(0, val01)) : 0;
  if (v === 0) return isDark ? '#21253a' : '#f0f2f8';
  const intensity = Math.min(Math.round(v * 5), 5);
  return isDark ? HEATMAP_BLUE_DARK[intensity] : HEATMAP_BLUE_LIGHT[intensity];
}

/** Vertical legend: low → high blue steps. */
export function heatmapLegendGradient(isDark) {
  const arr = isDark ? HEATMAP_BLUE_DARK : HEATMAP_BLUE_LIGHT;
  return `linear-gradient(to bottom, ${arr[0]}, ${arr[3]}, ${arr[5]})`;
}

