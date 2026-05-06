import { mulberry32 } from './seededRandom';
import {
  istAddCalendarDays,
  istDateFromParts,
} from './istDates';

/** Bottom/top axis labels (calendar reference style). */
export const HEATMAP_CAL_COL_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

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

/** Demo: fixed IST April scores (any year). Other dates use seeded random 0…15. */
const MOCK_APRIL_FIXED_SCORE = {
  6: 1,
  7: 5,
  8: 12,
  9: 0,
  10: 13,
};

const MOCK_SCORE_MAX = 15;

function mockScoreSeed(ymd) {
  return (ymd.y * 372 + ymd.m * 31 + ymd.d * 17 + 0x9e3779b9) >>> 0;
}

/** Integer occupancy index 0…15 for mock data. */
function mockOccupancyScore(ymd) {
  if (ymd.m === 4 && Object.prototype.hasOwnProperty.call(MOCK_APRIL_FIXED_SCORE, ymd.d)) {
    return MOCK_APRIL_FIXED_SCORE[ymd.d];
  }
  const rnd = mulberry32(mockScoreSeed(ymd));
  return Math.floor(rnd() * (MOCK_SCORE_MAX + 1));
}

/**
 * Calendar-style grid: rows = weeks (Sun–Sat), inclusive IST days from startYmd through endYmd.
 * Leading/trailing cells outside that span are empty.
 */
export function buildHeatmapCalendarGridModel(startYmd, endYmd) {
  const dayCount =
    istDayDistance(startYmd, endYmd) >= 0 ? istDayDistance(startYmd, endYmd) + 1 : 1;
  const gridSunday = gridSundayBeforeOrEqual(startYmd);
  const leading = istDayDistance(gridSunday, startYmd);
  const totalSpan = leading + dayCount;
  const numRows = Math.ceil(totalSpan / 7);

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

      if (seg < 0 || seg >= dayCount) {
        row.push({
          key: `empty-${r}-${c}`,
          empty: true,
        });
        continue;
      }

      const score = mockOccupancyScore(cellYmd);
      const rawAvg = Math.min(1, Math.max(0, score / MOCK_SCORE_MAX));
      const h1 = tooltipHeader(cellYmd);
      const h2 = `Index: ${score} (mock)`;

      row.push({
        key: `${cellYmd.y}-${String(cellYmd.m).padStart(2, '0')}-${String(cellYmd.d).padStart(2, '0')}`,
        empty: false,
        dayPadded: paddedDay(cellYmd.d),
        rawAvg: parseFloat(rawAvg.toFixed(4)),
        occupancyScore: score,
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

