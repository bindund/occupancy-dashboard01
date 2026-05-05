/** Theme tokens for Highcharts to match dashboard CSS variables. */

/** Exits series — cool blue-slate (pairs calmly with indigo / cyan / green entry accents). */
export const EXITS_SERIES_COLOR = '#5B6C8C';

export function getDashboardChartTheme(theme) {
  const isDark = theme === 'dark';
  return {
    text: isDark ? '#e8eaf6' : '#111827',
    muted: isDark ? '#8b92b3' : '#9399b8',
    grid: isDark ? '#2a2f42' : '#e2e5f0',
    tooltipBg: isDark ? '#21253a' : '#ffffff',
    tooltipBorder: isDark ? '#343a52' : '#e2e5f0',
  };
}

/** Shared defaults (column / line / area). Override per chart. */
export function baseChartOptions(theme, extra = {}) {
  const p = getDashboardChartTheme(theme);
  const base = {
    chart: {
      backgroundColor: 'transparent',
      style: { fontFamily: "'DM Sans', sans-serif" },
      spacing: [8, 8, 8, 8],
    },
    credits: { enabled: false },
    exporting: { enabled: false },
    title: { text: undefined },
    subtitle: { text: undefined },
    tooltip: {
      backgroundColor: p.tooltipBg,
      borderColor: p.tooltipBorder,
      borderWidth: 1,
      borderRadius: 8,
      style: { color: p.text, fontSize: '12px' },
    },
    legend: {
      itemStyle: { color: p.muted, fontSize: '11px', fontWeight: '500' },
      itemHoverStyle: { color: p.text },
    },
    xAxis: {
      lineWidth: 0,
      tickWidth: 0,
      gridLineWidth: 0,
      labels: { style: { color: p.muted, fontSize: '10px' } },
    },
    yAxis: {
      gridLineColor: p.grid,
      gridLineDashStyle: 'ShortDash',
      lineWidth: 0,
      tickWidth: 0,
      labels: { style: { color: p.muted, fontSize: '10px' } },
    },
  };

  const { chart: extraChart, xAxis: extraX, yAxis: extraY, legend: extraLegend, ...restExtra } = extra;
  return {
    ...base,
    ...restExtra,
    chart: extraChart ? { ...base.chart, ...extraChart } : base.chart,
    xAxis: extraX ? { ...base.xAxis, ...extraX } : base.xAxis,
    yAxis: extraY ? { ...base.yAxis, ...extraY } : base.yAxis,
    legend: extraLegend ? { ...base.legend, ...extraLegend } : base.legend,
  };
}
