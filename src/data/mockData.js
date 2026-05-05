// Mock data for the Occupancy Dashboard

export const KPI_DATA = {
  currentOccupancy: { value: 1031, change: 13.3, status: 'Live' },
  totalEntries: { value: 4783, change: 10.5 },
  totalExits: { value: 3752, change: 9.7 },
  peakToday: { value: 1268, time: '10:30 AM' },
};

/** KPI row keyed by floor tab — aggregate vs per-level (Figma). */
export const KPI_DATA_BY_FLOOR = {
  'All Floors': KPI_DATA,
  'Level 1': {
    currentOccupancy: { value: 678, change: 10.8, status: 'Live' },
    totalEntries: { value: 3218, change: 11.0 },
    totalExits: { value: 2540, change: 11.0 },
    peakToday: { value: 821, time: '10:30 AM' },
  },
  'Level 2': {
    currentOccupancy: { value: 333, change: 18.9, status: 'Live' },
    totalEntries: { value: 1180, change: 8.2 },
    totalExits: { value: 990, change: 7.5 },
    peakToday: { value: 512, time: '11:05 AM' },
  },
  'Level 3': {
    currentOccupancy: { value: 20, change: 11.1, status: 'Live' },
    totalEntries: { value: 780, change: 5.4 },
    totalExits: { value: 690, change: 4.8 },
    peakToday: { value: 156, time: '9:45 AM' },
  },
};

const trend14 = (seed, scale = 1) =>
  Array.from({ length: 14 }, (_, day) => {
    const wobble = Math.sin(day * 0.55 + seed) * 45 * scale;
    const entries = Math.round(320 + day * 28 * scale + wobble);
    const exits = Math.round(300 + day * 25 * scale + wobble * 0.92);
    return { day, dayLabel: String(day), entries, exits };
  });

const PEAK_TIME_LABELS = [
  '10:30 AM', '9:40 AM', '2:22 PM', '11:05 AM', '8:55 AM',
  '3:10 PM', '10:00 AM', '12:30 PM', '9:15 AM', '1:45 PM',
  '4:20 PM', '7:15 AM', '6:45 PM', '11:50 AM', '2:05 PM',
];

const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** @param {number} count total rows (paginate in UI; default 24) */
const peakRows = (base, spread, count = 24) => {
  const anchor = new Date(2026, 0, 22);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(anchor);
    d.setDate(d.getDate() - i * 2 - Math.floor(i / 5));
    const dateStr = `${d.getDate()} ${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`;
    return {
      rank: i + 1,
      date: dateStr,
      day: FULL_DAYS[d.getDay()],
      peakTime: PEAK_TIME_LABELS[i % PEAK_TIME_LABELS.length],
      month: MONTH_FULL[d.getMonth()],
      occupancy: Math.max(40, Math.round(base - i * spread - (i % 3) * 4)),
    };
  });
};

/** Single-floor dashboard content (indigo / cyan / green accents). */
export const FLOOR_LEVEL_VIEW = {
  'Level 1': {
    accent: '#4F46E5',
    detail: { occupancy: 678, entries: 3218, exits: 2540 },
    sparkline: Array.from({ length: 16 }, (_, i) => ({
      i,
      entries: 280 + i * 22 + (i % 4) * 8,
      exits: 260 + i * 20 + (i % 3) * 6,
    })),
    overview: {
      status: 'Rising',
      statusUp: true,
      netFlow: '+678',
      todayPeak: 821,
      todayPeakTime: '10:30 AM',
      comparisons: [
        { metric: 'Occupancy', current: '678', previous: '612', change: '+10.8%' },
        { metric: 'Entries', current: '3,218', previous: '2,899', change: '+11.0%' },
        { metric: 'Exits', current: '2,540', previous: '2,288', change: '+11.0%' },
      ],
    },
    trend14: trend14(1.1, 1),
    peakRecords: peakRows(892, 9, 24),
  },
  'Level 2': {
    accent: '#06B6D4',
    detail: { occupancy: 333, entries: 1180, exits: 990 },
    sparkline: Array.from({ length: 16 }, (_, i) => ({
      i,
      entries: 140 + i * 12 + (i % 4) * 5,
      exits: 128 + i * 11 + (i % 3) * 4,
    })),
    overview: {
      status: 'Rising',
      statusUp: true,
      netFlow: '+190',
      todayPeak: 512,
      todayPeakTime: '11:05 AM',
      comparisons: [
        { metric: 'Occupancy', current: '333', previous: '280', change: '+18.9%' },
        { metric: 'Entries', current: '1,180', previous: '1,090', change: '+8.2%' },
        { metric: 'Exits', current: '990', previous: '921', change: '+7.5%' },
      ],
    },
    trend14: trend14(2.4, 0.55),
    peakRecords: peakRows(548, 6, 24),
  },
  'Level 3': {
    accent: '#10B981',
    detail: { occupancy: 20, entries: 780, exits: 690 },
    sparkline: Array.from({ length: 16 }, (_, i) => ({
      i,
      entries: 42 + i * 8 + (i % 3) * 3,
      exits: 38 + i * 7 + (i % 2) * 2,
    })),
    overview: {
      status: 'Stable',
      statusUp: null,
      netFlow: '+90',
      todayPeak: 156,
      todayPeakTime: '9:45 AM',
      comparisons: [
        { metric: 'Occupancy', current: '20', previous: '18', change: '+11.1%' },
        { metric: 'Entries', current: '780', previous: '740', change: '+5.4%' },
        { metric: 'Exits', current: '690', previous: '658', change: '+4.8%' },
      ],
    },
    trend14: trend14(3.8, 0.22),
    peakRecords: peakRows(168, 5, 24),
  },
};

export const FORECAST_DATA = {
  peakForecast: 1150,
  window: '10:00 – 11:00 AM',
  confidence: 87,
  vsLastThursday: 10.4,
  dailyAverage: 680,
  quietWindow: '7–9 AM',
  quietPeak: 210,
  secondaryPeak: '2–3 PM',
  secondaryPeakPpl: 820,
  /** Hours shown in darker teal (peak window); max hour gets strongest fill in UI */
  highlightHours: ['10A', '11A'],
  hourly: [
    { hour: '7A', val: 120 }, { hour: '8A', val: 280 }, { hour: '9A', val: 620 },
    { hour: '10A', val: 900 }, { hour: '11A', val: 1150 }, { hour: '12P', val: 820 },
    { hour: '1P', val: 680 }, { hour: '2P', val: 750 }, { hour: '3P', val: 640 },
    { hour: '4P', val: 480 }, { hour: '5P', val: 310 }, { hour: '6P', val: 190 },
  ],
};

export const NET_FLOW_DATA = [
  { date: 'Feb 16', actual: 110, forecast: 108, upper: 119, lower: 97 },
  { date: 'Feb 17', actual: 125, forecast: 122, upper: 134, lower: 110 },
  { date: 'Feb 18', actual: 118, forecast: 120, upper: 132, lower: 108 },
  { date: 'Feb 19', actual: 108, forecast: 112, upper: 123, lower: 101 },
  { date: 'Feb 20', actual: 105, forecast: 110, upper: 121, lower: 99 },
  { date: 'Feb 21', actual: 98, forecast: 102, upper: 112, lower: 92 },
  { date: 'Feb 22', actual: 20, forecast: 55, upper: 60, lower: 50 },
  { date: 'Feb 23', actual: 18, forecast: 20, upper: 22, lower: 18 },
  { date: 'Feb 24', actual: null, forecast: 85, upper: 93, lower: 77 },
  { date: 'Feb 25', actual: null, forecast: 92, upper: 101, lower: 83 },
  { date: 'Feb 26', actual: null, forecast: 118, upper: 130, lower: 106 },
  { date: 'Feb 27', actual: null, forecast: 122, upper: 134, lower: 110 },
  { date: 'Feb 28', actual: null, forecast: 108, upper: 119, lower: 97 },
  { date: 'Mar 1', actual: null, forecast: 125, upper: 137, lower: 113 },
];

export const OCCUPANCY_TREND_DATA = (() => {
  const dates = ['Feb 16', 'Feb 17', 'Feb 18', 'Feb 19', 'Feb 20', 'Feb 21', 'Feb 22', 'Feb 23'];
  return dates.flatMap((date, di) => {
    const hours = Array.from({ length: 24 }, (_, h) => {
      const base = h >= 8 && h <= 18 ? Math.random() * 800 + 200 : Math.random() * 50;
      return {
        time: `${date} ${h}:00`,
        L1: Math.round(base * (0.5 + Math.random() * 0.3)),
        L2: Math.round(base * (0.3 + Math.random() * 0.2)),
        L3: Math.round(base * (0.05 + Math.random() * 0.05)),
        L4: Math.round(base * (0.2 + Math.random() * 0.15)),
        L5: Math.round(base * (0.15 + Math.random() * 0.1)),
        L6: Math.round(base * (0.1 + Math.random() * 0.08)),
      };
    });
    return hours;
  });
})();

export const ENTRIES_EXITS_BY_FLOOR = [
  { floor: 'Level 1', entries: 3400, exits: 2900 },
  { floor: 'Level 2', entries: 1100, exits: 980 },
  { floor: 'Level 3', entries: 780, exits: 690 },
  { floor: 'Level 4', entries: 920, exits: 850 },
  { floor: 'Level 5', entries: 560, exits: 490 },
  { floor: 'Level 6', entries: 340, exits: 310 },
];

export const HOURWISE_UTILIZATION = [
  { hour: '00:00', L1: 2, L2: 1, L3: 0, L4: 1 },
  { hour: '02:00', L1: 1, L2: 0, L3: 0, L4: 0 },
  { hour: '04:00', L1: 2, L2: 1, L3: 0, L4: 1 },
  { hour: '06:00', L1: 5, L2: 3, L3: 1, L4: 2 },
  { hour: '08:00', L1: 18, L2: 12, L3: 2, L4: 8 },
  { hour: '10:00', L1: 28, L2: 18, L3: 4, L4: 14 },
  { hour: '12:00', L1: 24, L2: 16, L3: 3, L4: 11 },
  { hour: '14:00', L1: 26, L2: 17, L3: 4, L4: 13 },
  { hour: '16:00', L1: 20, L2: 13, L3: 3, L4: 10 },
  { hour: '18:00', L1: 12, L2: 8, L3: 2, L4: 6 },
  { hour: '20:00', L1: 6, L2: 4, L3: 1, L4: 3 },
  { hour: '22:00', L1: 3, L2: 2, L3: 0, L4: 1 },
];

export const HEATMAP_DATA = (() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm'];
  return hours.map(hour => {
    const row = { hour };
    days.forEach(day => {
      const isWeekend = day === 'Sat' || day === 'Sun';
      const h = parseInt(hour);
      let val = 0;
      if (!isWeekend) {
        if (h >= 9 && h <= 11) val = Math.random() * 0.4 + 0.6;
        else if (h >= 12 && h <= 14) val = Math.random() * 0.3 + 0.5;
        else if (h >= 8 && h <= 15) val = Math.random() * 0.3 + 0.2;
        else val = Math.random() * 0.1;
      } else {
        val = Math.random() * 0.15;
      }
      row[day] = parseFloat(val.toFixed(2));
    });
    return row;
  });
})();

export const RECENT_REPORTS = [
  { name: 'February 2026 – Monthly Report', date: '02 Mar 2026', size: '2.4 MB', type: 'monthly' },
  { name: 'Q1 2026 – Quarterly Report', date: '05 Apr 2026', size: '5.8 MB', type: 'quarterly' },
  { name: 'January 2026 – Monthly Report', date: '01 Feb 2026', size: '2.1 MB', type: 'monthly' },
];

/** All-floors comparative row (bars scale to highest level). */
export const FLOOR_ACTIVITY_OVERVIEW = [
  { levelKey: 'L1', occupancy: 678, changePct: 10.8 },
  { levelKey: 'L2', occupancy: 333, changePct: 18.9 },
  { levelKey: 'L3', occupancy: 20, changePct: 11.1 },
  { levelKey: 'L4', occupancy: 245, changePct: 16.7 },
  { levelKey: 'L5', occupancy: 112, changePct: 14.3 },
  { levelKey: 'L6', occupancy: 58, changePct: 11.5 },
];

export const LEVEL_COLORS = {
  'Level 1': '#4F46E5',
  'Level 2': '#06B6D4',
  'Level 3': '#10B981',
  'Level 4': '#EF4444',
  'Level 5': '#8B5CF6',
  'Level 6': '#F97316',
  L1: '#4F46E5',
  L2: '#06B6D4',
  L3: '#10B981',
  L4: '#EF4444',
  L5: '#8B5CF6',
  L6: '#F97316',
};
