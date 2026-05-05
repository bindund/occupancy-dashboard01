import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { LEVEL_COLORS } from '../../data/mockData';

const LEVEL_KEYS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

const TREND_DAY_LABEL = '16 Feb 2026';

function formatHour12(h) {
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

/** Single calendar day: 24 hourly points from 12 AM through 11 PM. */
const TREND_DATA = (() => {
  const result = [];
  for (let h = 0; h < 24; h++) {
    const isDay = h >= 8 && h <= 18;
    const base = isDay ? Math.random() * 600 + 200 : Math.random() * 40;
    result.push({
      hour: h,
      L1: Math.round(base * 0.55),
      L2: Math.round(base * 0.28),
      L3: Math.round(base * 0.05),
      L4: Math.round(base * 0.22),
      L5: Math.round(base * 0.14),
      L6: Math.round(base * 0.09),
    });
  }
  return result;
})();

/** Fixed scale so Y ticks read 0 → 2000 in steps of 500. */
const Y_DOMAIN_MAX = 2000;
const Y_TICKS = [0, 500, 1000, 1500, 2000];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const timeLabel = typeof label === 'number' ? formatHour12(label) : label;
  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '8px 12px', fontSize: 11, maxWidth: 160,
    }}>
      <div style={{ color: 'var(--text3)', marginBottom: 4, fontSize: 10 }}>{timeLabel}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <span>{p.dataKey}</span><span>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function OccupancyTrendChart() {
  return (
    <div className="card occupancy-trend-card">
      <div className="occupancy-trend-head">
        <div>
          <div className="card-title">Occupancy Trend</div>
          <div className="card-subtitle occupancy-trend-sub">All floors · {TREND_DAY_LABEL} · 12 AM – 11 PM</div>
        </div>
        <div className="trend-legend">
          {LEVEL_KEYS.map(l => (
            <div key={l} className="legend-item">
              <div className="legend-dot" style={{ background: LEVEL_COLORS[l] }} />
              {l.replace('L', 'Level ')}
            </div>
          ))}
        </div>
      </div>

      <div className="occupancy-trend-chart-shell">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={TREND_DATA} margin={{ top: 4, right: 6, left: 4, bottom: 2 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="hour"
              type="number"
              domain={[0, 23]}
              ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 23]}
              tickFormatter={formatHour12}
              tick={{ fontSize: 9, fill: 'var(--text3)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, Y_DOMAIN_MAX]}
              ticks={Y_TICKS}
              tick={{ fontSize: 9, fill: 'var(--text3)' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            {LEVEL_KEYS.map(l => (
              <Line
                key={l}
                dataKey={l}
                stroke={LEVEL_COLORS[l]}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
