import React, { useMemo, useState, useEffect, useContext } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
} from 'lucide-react';
import { FLOOR_LEVEL_VIEW } from '../../data/mockData';
import { ThemeContext } from '../../App';
import { hexAlpha } from '../../utils/color';
import { baseChartOptions, getDashboardChartTheme, EXITS_SERIES_COLOR } from '../../utils/chartTheme';

/**
 * Live snapshot — compact entries (area) + exits (dashed line), Figma-style sparkline.
 */
function FloorSnapshotFlowChart({ data, accent }) {
  const { theme } = useContext(ThemeContext);

  const options = useMemo(() => {
    const palette = getDashboardChartTheme(theme);
    const entries = data.map(d => d.entries);
    const exits = data.map(d => d.exits);
    const categories = data.map((_, i) => `+${i + 1}`);
    const all = [...entries, ...exits];
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    const pad = Math.max((hi - lo) * 0.15, 8);
    const yMin = Math.max(0, lo - pad);
    const yMax = hi + pad;

    return baseChartOptions(theme, {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        margin: [34, 6, 6, 6],
        spacing: [2, 2, 2, 2],
        reflow: true,
      },
      title: { text: null },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'top',
        layout: 'horizontal',
        margin: 0,
        padding: 0,
        symbolWidth: 14,
        symbolHeight: 3,
        symbolRadius: 1,
        itemStyle: { color: palette.muted, fontSize: '11px', fontWeight: '500' },
        itemDistance: 18,
      },
      xAxis: {
        categories,
        visible: true,
        lineWidth: 0,
        tickLength: 0,
        tickWidth: 0,
        labels: { enabled: false },
        crosshair: false,
      },
      yAxis: {
        min: yMin,
        max: yMax,
        visible: false,
        endOnTick: false,
      },
      plotOptions: {
        areaspline: {
          lineWidth: 2,
          marker: { enabled: false },
          states: { hover: { lineWidthPlus: 0 } },
        },
        line: {
          lineWidth: 2,
          marker: { enabled: false },
        },
        series: { animation: { duration: 500 } },
      },
      tooltip: {
        shared: true,
        formatter() {
          const pts = this.points || [];
          const cat = pts[0]?.category ?? '';
          let s = `<span style="font-size:10px;color:${palette.muted}">${cat}</span><br/>`;
          pts.forEach(p => {
            s += `<span style="color:${p.color}">\u25CF</span> ${p.series.name}: <b>${Highcharts.numberFormat(p.y, 0)}</b><br/>`;
          });
          return s;
        },
      },
      series: [
        {
          type: 'areaspline',
          name: 'Entries',
          data: entries,
          color: accent,
          zIndex: 2,
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, hexAlpha(accent, 0.38)],
              [1, hexAlpha(accent, 0.02)],
            ],
          },
        },
        {
          type: 'line',
          name: 'Exits',
          data: exits,
          color: EXITS_SERIES_COLOR,
          dashStyle: 'ShortDash',
          zIndex: 1,
        },
      ],
    });
  }, [data, accent, theme]);

  return (
    <div className="floor-snapshot-chart-wrap">
      <div className="floor-snapshot-chart-label">Live snapshot · entries vs exits flow</div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ className: 'floor-snapshot-chart-hc' }}
      />
    </div>
  );
}

function comparisonRow(comparisons, metric) {
  return comparisons.find(c => c.metric === metric);
}

function changeChipTone(change) {
  if (!change) return 'floor-snapshot-chip';
  if (change.trim().startsWith('-')) return 'floor-snapshot-chip floor-snapshot-chip--down';
  if (change.trim().startsWith('+')) return 'floor-snapshot-chip floor-snapshot-chip--up';
  return 'floor-snapshot-chip';
}

/**
 * 14-day trend — dual line chart with point labels (Highcharts line-labels style).
 */
function FloorEntryExitTrend({ floorName, data, accent }) {
  const { theme } = useContext(ThemeContext);

  const chartOptions = useMemo(() => {
    const palette = getDashboardChartTheme(theme);
    const categories = data.map(d => `Day ${d.day}`);
    const entries = data.map(d => d.entries);
    const exits = data.map(d => d.exits);
    const all = [...entries, ...exits];
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    const span = Math.max(hi - lo, 1);
    const pad = span * 0.08;
    const yMin = Math.max(0, Math.floor((lo - pad) / 20) * 20);
    const yMax = Math.ceil((hi + pad) / 20) * 20;

    const labelStyle = {
      fontSize: '9px',
      fontWeight: '600',
      textOutline: 'none',
    };

    return baseChartOptions(theme, {
      chart: {
        type: 'line',
        reflow: true,
        spacing: [8, 12, 8, 8],
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        margin: 8,
        itemStyle: { color: palette.muted, fontSize: '11px', fontWeight: '500' },
      },
      xAxis: {
        categories,
        title: { text: null },
        crosshair: true,
        lineWidth: 0,
        tickWidth: 0,
        labels: { style: { color: palette.muted, fontSize: '10px' } },
      },
      yAxis: {
        min: yMin,
        max: yMax,
        endOnTick: false,
        title: { text: null },
        gridLineWidth: 1,
        labels: { style: { color: palette.muted, fontSize: '10px' } },
      },
      plotOptions: {
        line: {
          marker: { enabled: true, radius: 3, symbol: 'circle' },
          lineWidth: 2,
          dataLabels: {
            enabled: true,
            padding: 2,
            allowOverlap: true,
            style: labelStyle,
            formatter() {
              return Highcharts.numberFormat(this.y, 0);
            },
          },
        },
        series: { animation: { duration: 450 } },
      },
      tooltip: {
        shared: true,
        formatter() {
          const pts = this.points || [];
          const cat = pts[0]?.category ?? pts[0]?.key ?? '';
          let s = `<span style="font-size:11px;font-weight:600">${cat}</span><br/>`;
          let sum = 0;
          pts.forEach(p => {
            sum += p.y;
            s += `<span style="color:${p.color}">\u25CF</span> ${p.series.name}: <b>${Highcharts.numberFormat(p.y, 0)}</b><br/>`;
          });
          s += `<span style="color:${palette.muted}">Total: <b>${Highcharts.numberFormat(sum, 0)}</b></span>`;
          return s;
        },
      },
      series: [
        { type: 'line', name: 'Entries', data: entries, color: accent },
        { type: 'line', name: 'Exits', data: exits, color: EXITS_SERIES_COLOR, lineWidth: 1.75 },
      ],
    });
  }, [data, accent, theme]);

  return (
    <div className="card full-row floor-trend-card">
      <div className="card-title">{floorName} – Entry &amp; Exit Trend</div>
      <div className="card-subtitle" style={{ marginBottom: 10 }}>14-day historical pattern</div>
      <div className="hc-chart-host hc-chart-host--floor-trend">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          containerProps={{ className: 'hc-chart-inner' }}
        />
      </div>
    </div>
  );
}

const PEAK_PAGE_SIZE = 6;

function PeakOccupancyTable({ rows, accent, floorName }) {
  const [page, setPage] = useState(0);
  const maxOcc = useMemo(() => Math.max(...rows.map(r => r.occupancy), 1), [rows]);
  const totalPages = Math.max(1, Math.ceil(rows.length / PEAK_PAGE_SIZE));
  const activePage = Math.min(page, totalPages - 1);
  const start = activePage * PEAK_PAGE_SIZE;
  const pageRows = rows.slice(start, start + PEAK_PAGE_SIZE);
  const showingEnd = Math.min(start + pageRows.length, rows.length);

  useEffect(() => {
    setPage(p => Math.min(p, totalPages - 1));
  }, [totalPages]);

  const medal = r => {
    if (r === 1) return '🥇';
    if (r === 2) return '🥈';
    if (r === 3) return '🥉';
    return null;
  };

  return (
    <div className="card full-row floor-peak-card">
      <div className="card-title">Peak Occupancy Records</div>
      <div className="card-subtitle" style={{ marginBottom: 4 }}>
        Highest occupancy moments for {floorName}, ranked by peak count
      </div>

      <div className="peak-table-panel">
        <div className="peak-table-toolbar">
          <div className="peak-toolbar-floor">
            <span className="peak-floor-dot" style={{ background: accent }} aria-hidden />
            <span>{floorName}</span>
          </div>
          <div className="peak-toolbar-note">
            <Trophy size={14} strokeWidth={2} className="peak-toolbar-icon" aria-hidden />
            <span>{rows.length} peak occupancy records</span>
          </div>
        </div>

        <div className="peak-table-scroll">
          <table className="peak-records-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Day</th>
                <th>Peak time</th>
                <th>Month</th>
                <th>Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map(row => (
                <tr
                  key={`${row.rank}-${row.date}-${row.peakTime}`}
                  className={row.rank <= 3 ? 'peak-row--podium' : undefined}
                >
                  <td className="peak-rank">
                    {medal(row.rank) ? (
                      <span className="peak-medal" aria-label={`Rank ${row.rank}`}>
                        {medal(row.rank)}
                      </span>
                    ) : (
                      <span className="peak-rank-num">{row.rank}</span>
                    )}
                  </td>
                  <td className="peak-cell-date">{row.date}</td>
                  <td>{row.day}</td>
                  <td className="peak-time-cell">
                    <span className="peak-time-badge">{row.peakTime}</span>
                  </td>
                  <td className="peak-month-cell">
                    <span className="peak-month-pill">{row.month}</span>
                  </td>
                  <td>
                    <div className="peak-occ-cell">
                      <div className="peak-occ-bar-track">
                        <div
                          className="peak-occ-bar-fill"
                          style={{ width: `${(row.occupancy / maxOcc) * 100}%`, background: accent }}
                        />
                      </div>
                      <span className="peak-occ-val">{row.occupancy.toLocaleString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="peak-pagination">
          <span className="peak-page-range">
            Showing {rows.length ? start + 1 : 0}–{showingEnd} of {rows.length}
          </span>
          <div className="peak-pagination-controls">
            <button
              type="button"
              className="peak-page-btn"
              disabled={activePage <= 0}
              onClick={() => setPage(Math.max(0, activePage - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="peak-page-btn"
              disabled={activePage >= totalPages - 1}
              onClick={() => setPage(Math.min(totalPages - 1, activePage + 1))}
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FloorLevelView({ floor }) {
  const cfg = FLOOR_LEVEL_VIEW[floor];
  if (!cfg) return null;

  const { accent, detail, overview, sparkline, trend14, peakRecords } = cfg;
  const StatusIcon =
    overview.statusUp === true ? TrendingUp : overview.statusUp === false ? TrendingDown : Minus;

  const occCmp = comparisonRow(overview.comparisons, 'Occupancy');
  const entCmp = comparisonRow(overview.comparisons, 'Entries');
  const extCmp = comparisonRow(overview.comparisons, 'Exits');
  const netArrow = String(overview.netFlow).trim().startsWith('-') ? '↘' : '↗';

  return (
    <div className="floor-level-view" style={{ '--floor-accent': accent }}>
      <div className="floor-level-top">
        <div className="card floor-detail-card floor-detail-card--snapshot">
          <div className="floor-detail-toprow">
            <div className="floor-detail-titleblock">
              <div className="floor-detail-title-row">
                <span className="floor-detail-dot" style={{ background: accent }} aria-hidden />
                <span className="floor-detail-title">{floor}</span>
              </div>
              <p className="floor-detail-peakline">
                Peak today:{' '}
                <strong>{overview.todayPeak.toLocaleString()}</strong>
                {' @ '}
                {overview.todayPeakTime}
              </p>
            </div>
            <span
              className="floor-detail-status-pill"
              style={{
                color: accent,
                borderColor: hexAlpha(accent, 0.42),
                backgroundColor: hexAlpha(accent, 0.14),
              }}
            >
              <StatusIcon size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              {overview.status}
            </span>
          </div>

          <div className="floor-snapshot-grid">
            <div className="floor-snapshot-occ">
              <div className="floor-snapshot-occ-label">Current occupancy</div>
              <div className="floor-snapshot-occ-row floor-snapshot-occ-row--stacked">
                <span className="floor-snapshot-occ-num">{detail.occupancy.toLocaleString()}</span>
                <div className="floor-snapshot-occ-meta">
                  {occCmp?.change ? (
                    <span className={changeChipTone(occCmp.change)}>
                      {occCmp.change.startsWith('+')
                        ? `↗ ${occCmp.change.slice(1)}`
                        : occCmp.change.startsWith('-')
                          ? `↘ ${occCmp.change.slice(1)}`
                          : occCmp.change}
                    </span>
                  ) : null}
                  <span className="floor-snapshot-net">
                    {netArrow} Net {overview.netFlow} flow
                  </span>
                </div>
              </div>
            </div>

            <div className="floor-snapshot-mini floor-snapshot-mini--entries">
              <div className="floor-snapshot-mini-head">
                <LogIn size={14} strokeWidth={2.25} className="floor-snapshot-mini-ico" aria-hidden />
                <span className="floor-snapshot-mini-label">Entries</span>
              </div>
              <div className="floor-snapshot-mini-val">{detail.entries.toLocaleString()}</div>
              {entCmp?.change ? (
                <div
                  className={`floor-snapshot-mini-delta${entCmp.change.trim().startsWith('-') ? ' floor-snapshot-mini-delta--down' : ' floor-snapshot-mini-delta--up'
                    }`}
                >
                  {entCmp.change.startsWith('+')
                    ? `↗ ${entCmp.change.slice(1)}`
                    : entCmp.change.startsWith('-')
                      ? `↘ ${entCmp.change.slice(1)}`
                      : entCmp.change}
                </div>
              ) : null}
            </div>
            <div className="floor-snapshot-mini floor-snapshot-mini--exits">
              <div className="floor-snapshot-mini-head">
                <LogOut size={14} strokeWidth={2.25} className="floor-snapshot-mini-ico floor-snapshot-mini-ico--exits" aria-hidden />
                <span className="floor-snapshot-mini-label floor-snapshot-mini-label--exits">Exits</span>
              </div>
              <div className="floor-snapshot-mini-val">{detail.exits.toLocaleString()}</div>
              {extCmp?.change ? (
                <div
                  className={`floor-snapshot-mini-delta${extCmp.change.trim().startsWith('-') ? ' floor-snapshot-mini-delta--down' : ' floor-snapshot-mini-delta--up'
                    }`}
                >
                  {extCmp.change.startsWith('+')
                    ? `↗ ${extCmp.change.slice(1)}`
                    : extCmp.change.startsWith('-')
                      ? `↘ ${extCmp.change.slice(1)}`
                      : extCmp.change}
                </div>
              ) : null}
            </div>
          </div>

          <FloorSnapshotFlowChart data={sparkline} accent={accent} />
        </div>

        <div className="card floor-overview-card">
          <div className="card-title" style={{ marginBottom: 10 }}>Level overview</div>
          <div className="floor-overview-row">
            <span className="floor-overview-label">Status</span>
            <span
              className="floor-overview-pill"
              style={{
                color: accent,
                borderColor: hexAlpha(accent, 0.4),
                backgroundColor: hexAlpha(accent, 0.12),
              }}
            >
              <StatusIcon size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              {overview.status}
            </span>
          </div>
          <div className="floor-overview-row">
            <span className="floor-overview-label">Net flow</span>
            <span className="floor-overview-strong">{overview.netFlow}</span>
          </div>
          <div className="floor-overview-row">
            <span className="floor-overview-label">{"Today's peak"}</span>
            <span className="floor-overview-strong">
              {overview.todayPeak.toLocaleString()}
              <span className="floor-overview-sub"> @ {overview.todayPeakTime}</span>
            </span>
          </div>
          <div className="floor-compare-head">Comparison vs previous period</div>
          <table className="floor-compare-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Current</th>
                <th>Previous</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {overview.comparisons.map(row => (
                <tr key={row.metric}>
                  <td>{row.metric}</td>
                  <td>{row.current}</td>
                  <td>{row.previous}</td>
                  <td style={{ color: accent, fontWeight: 600 }}>{row.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FloorEntryExitTrend floorName={floor} data={trend14} accent={accent} />
      <PeakOccupancyTable key={floor} rows={peakRecords} accent={accent} floorName={floor} />
    </div>
  );
}

