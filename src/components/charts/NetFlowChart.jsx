import React, { useContext } from 'react';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { NET_FLOW_DATA } from '../../data/mockData';
import { ThemeContext } from '../../App';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '8px 12px', fontSize: 12
    }}>
      <div style={{ color: 'var(--text3)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {p.value !== null ? p.value : '-'}
        </div>
      ))}
    </div>
  );
};

export default function NetFlowChart() {
  const { theme } = useContext(ThemeContext);
  const gridColor = theme === 'dark' ? '#2a2f42' : '#e2e5f0';
  const areaFill = theme === 'dark' ? 'rgba(79,70,229,0.08)' : 'rgba(79,70,229,0.06)';
  const areaBg = theme === 'dark' ? '#0f1117' : '#f0f2f8';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="net-flow-header">
        <div>
          <div className="card-title">Net Flow Momentum — All Floors — Today</div>
          <div className="card-subtitle">Net flow per 30-min window · Forecast confidence ±10%</div>
        </div>
        <button className="btn-sm">Daily Analysis</button>
      </div>

      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>Net Flow: Actual vs Forecast</div>

      <ResponsiveContainer width="100%" height={160}>
        <ComposedChart data={NET_FLOW_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--text3)' }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--text3)' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 140]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x="Feb 24" stroke="var(--orange)" strokeDasharray="4 2" strokeWidth={1.5} />
          <Area dataKey="upper" fill={areaFill} stroke="none" name="Upper bound" />
          <Area dataKey="lower" fill={areaBg} stroke="none" name="Lower bound" />
          <Line
            dataKey="actual"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={{ fill: '#4F46E5', r: 3, strokeWidth: 0 }}
            connectNulls={false}
            name="Actual"
          />
          <Line
            dataKey="forecast"
            stroke="var(--orange)"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            dot={false}
            name="Forecast"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-line" style={{ background: '#4F46E5' }} />
          Actual Net Flow
        </div>
        <div className="legend-item">
          <div className="legend-dash" style={{ borderColor: 'var(--orange)' }} />
          Forecasted Net Flow
        </div>
        <div className="legend-item">
          <div className="legend-area" style={{ background: '#4F46E5' }} />
          Forecast Confidence (±10%)
        </div>
      </div>
    </div>
  );
}
