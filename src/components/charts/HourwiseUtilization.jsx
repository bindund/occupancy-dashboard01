import React, { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import { HOURWISE_UTILIZATION, LEVEL_COLORS } from '../../data/mockData';
import { formatDateFilterRangeLabel } from '../../utils/istDates';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 12px', fontSize: 12
        }}>
            <div style={{ color: 'var(--text3)', marginBottom: 4 }}>{label}</div>
            {payload.map(p => (
                <div key={p.dataKey} style={{ color: p.fill }}>
                    {p.name}: {p.value}
                </div>
            ))}
        </div>
    );
};

export default function HourwiseUtilization({ activeTime = 'Today' }) {
    const [mode, setMode] = useState('stacked');

    const scaled = useMemo(() => {
        const factor = activeTime === 'Today' ? 1 : activeTime === 'Week' ? 3.2 : 6.9;
        return HOURWISE_UTILIZATION.map(row => {
            const next = { hour: row.hour };
            ['L1', 'L2', 'L3', 'L4'].forEach(k => {
                next[k] = Math.max(0, Math.round(row[k] * factor));
            });
            return next;
        });
    }, [activeTime]);

    const scopeNote =
        activeTime === 'Today'
            ? 'Data shown for today (IST)'
            : activeTime === 'Week'
              ? 'Aggregated for the selected week (IST)'
              : 'Aggregated for the selected month (IST)';

    return (
        <div className="card full-row">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                <div>
                    <div className="card-title">Hour-wise Utilization</div>
                    <div className="card-subtitle">Hourly occupancy distribution across floors</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{formatDateFilterRangeLabel(activeTime)}</span>
                    <div className="chart-toggle">
                        <button type="button" className={`toggle-btn ${mode === 'stacked' ? 'active' : ''}`} onClick={() => setMode('stacked')}>
                            Stacked View
                        </button>
                        <button type="button" className={`toggle-btn ${mode === 'grouped' ? 'active' : ''}`} onClick={() => setMode('grouped')}>
                            Grouped
                        </button>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
                <BarChart
                    data={scaled}
                    barCategoryGap="20%"
                    margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#545d82' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#545d82' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    {['L1', 'L2', 'L3', 'L4'].map(l => (
                        <Bar
                            key={l}
                            dataKey={l}
                            name={`Floor ${l.slice(1)}`}
                            fill={LEVEL_COLORS[l]}
                            stackId={mode === 'stacked' ? 'a' : undefined}
                            radius={mode === 'stacked' ? [0, 0, 0, 0] : [2, 2, 0, 0]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <div className="legend">
                    {['L1', 'L2', 'L3', 'L4'].map(l => (
                        <div key={l} className="legend-item">
                            <div className="legend-dot" style={{ background: LEVEL_COLORS[l] }} />
                            {`Floor ${l.slice(1)}`}
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text3)' }}>
                    <span>● Floor 1: 678%</span>
                    <span>● Floor 2: 333%</span>
                    <span>● Floor 3: 20%</span>
                    <span>● Floor 4: 245%</span>
                </div>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 6 }}>
                {scopeNote}
            </div>
        </div>
    );
}
