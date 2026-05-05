import React, { useId, useMemo, useContext } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { FLOOR_LEVEL_VIEW } from '../../data/mockData';
import { ThemeContext } from '../../App';
import { hexAlpha } from '../../utils/color';

const EXITS_LINE = '#94A3B8';

function FloorSparkline({ data, accent }) {
  return (
    <div className="floor-sparkline-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <Line type="monotone" dataKey="entries" stroke={accent} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="exits" stroke={EXITS_LINE} strokeWidth={1.5} dot={false} strokeOpacity={0.9} />
        </LineChart>
      </ResponsiveContainer>
      <div className="floor-sparkline-legend">
        <span><i style={{ background: accent }} /> Entries</span>
        <span><i style={{ background: EXITS_LINE }} /> Exits</span>
      </div>
    </div>
  );
}

function FloorEntryExitTrend({ floorName, data, accent }) {
  const gid = useId().replace(/:/g, '');
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const gridStroke = 'var(--border)';

  const gradId = `entriesFill-${gid}`;

  return (
    <div className="card full-row floor-trend-card">
      <div className="card-title">{floorName} – Entry &amp; Exit Trend</div>
      <div className="card-subtitle" style={{ marginBottom: 10 }}>14-day historical pattern</div>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity={isDark ? 0.4 : 0.32} />
              <stop offset="100%" stopColor={accent} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
          <XAxis
            dataKey="dayLabel"
            tick={{ fontSize: 10, fill: 'var(--text3)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(_, p) => (p?.[0]?.payload ? `Day ${p[0].payload.day}` : '')}
          />
          <Area type="monotone" dataKey="entries" stroke={accent} fill={`url(#${gradId})`} strokeWidth={2} />
          <Line type="monotone" dataKey="exits" stroke={EXITS_LINE} strokeWidth={1.5} dot={false} strokeOpacity={0.95} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="legend" style={{ marginTop: 8 }}>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: accent }} /> Entries
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: EXITS_LINE }} /> Exits
        </div>
      </div>
    </div>
  );
}

function PeakOccupancyTable({ rows, accent, floorName }) {
  const maxOcc = useMemo(() => Math.max(...rows.map(r => r.occupancy), 1), [rows]);
  const medal = r => {
    if (r === 1) return '🥇';
    if (r === 2) return '🥈';
    if (r === 3) return '🥉';
    return null;
  };

  return (
    <div className="card full-row floor-peak-card">
      <div className="card-title">Peak Occupancy Records</div>
      <div className="card-subtitle" style={{ marginBottom: 12 }}>
        Top 10 highest occupancy moments for {floorName}
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
            {rows.map(row => (
              <tr key={`${row.rank}-${row.date}`}>
                <td className="peak-rank">
                  {medal(row.rank) && <span className="peak-medal">{medal(row.rank)}</span>}
                  <span>{row.rank}</span>
                </td>
                <td>{row.date}</td>
                <td>{row.day}</td>
                <td>{row.peakTime}</td>
                <td>{row.month}</td>
                <td>
                  <div className="peak-occ-cell">
                    <span className="peak-occ-val">{row.occupancy.toLocaleString()}</span>
                    <div className="peak-occ-bar-track">
                      <div
                        className="peak-occ-bar-fill"
                        style={{ width: `${(row.occupancy / maxOcc) * 100}%`, background: accent }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function FloorLevelView({ floor }) {
  const cfg = FLOOR_LEVEL_VIEW[floor];
  if (!cfg) return null;

  const { accent, detail, sparkline, overview, trend14, peakRecords } = cfg;
  const StatusIcon =
    overview.statusUp === true ? TrendingUp : overview.statusUp === false ? TrendingDown : Minus;

  return (
    <div className="floor-level-view" style={{ '--floor-accent': accent }}>
      <div className="floor-level-top">
        <div className="card floor-detail-card">
          <div className="floor-detail-head">
            <div className="card-title" style={{ marginBottom: 0 }}>{floor}</div>
            <div className="card-subtitle">Live snapshot · entries vs exits flow</div>
          </div>
          <div className="floor-detail-metrics">
            <div>
              <label>Current occupancy</label>
              <div className="floor-detail-val" style={{ color: accent }}>{detail.occupancy.toLocaleString()}</div>
            </div>
            <div>
              <label>Entries</label>
              <div className="floor-detail-val">{detail.entries.toLocaleString()}</div>
            </div>
            <div>
              <label>Exits</label>
              <div className="floor-detail-val">{detail.exits.toLocaleString()}</div>
            </div>
          </div>
          <FloorSparkline data={sparkline} accent={accent} />
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
      <PeakOccupancyTable rows={peakRecords} accent={accent} floorName={floor} />
    </div>
  );
}
