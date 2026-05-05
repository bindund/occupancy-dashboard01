import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ENTRIES_EXITS_BY_FLOOR } from '../../data/mockData';
import { EXITS_SERIES_COLOR } from '../../utils/chartTheme';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 12px', fontSize: 12
        }}>
            <div style={{ color: 'var(--text3)', marginBottom: 4 }}>{label}</div>
            {payload.map(p => (
                <div key={p.dataKey} style={{ color: p.color }}>
                    {p.name}: {p.value.toLocaleString()}
                </div>
            ))}
        </div>
    );
};

export default function EntriesExitsChart() {
    const [mode, setMode] = useState('grouped');

    return (
        <div className="card full-row">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                <div>
                    <div className="card-title">Entries vs Exits by Floor</div>
                    <div className="card-subtitle">Traffic comparison across floors for selected period</div>
                </div>
                <div className="chart-toggle">
                    <button className={`toggle-btn ${mode === 'stacked' ? 'active' : ''}`} onClick={() => setMode('stacked')}>
                        Stacked
                    </button>
                    <button className={`toggle-btn ${mode === 'grouped' ? 'active' : ''}`} onClick={() => setMode('grouped')}>
                        Grouped
                    </button>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
                <BarChart
                    data={ENTRIES_EXITS_BY_FLOOR}
                    barCategoryGap="30%"
                    barGap={4}
                    margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                        dataKey="floor"
                        tick={{ fontSize: 11, fill: '#545d82' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: '#545d82' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="entries"
                        name="Entries"
                        fill="#4F46E5"
                        radius={[4, 4, 0, 0]}
                        stackId={mode === 'stacked' ? 'a' : undefined}
                    />
                    <Bar
                        dataKey="exits"
                        name="Exits"
                        fill={EXITS_SERIES_COLOR}
                        radius={mode === 'stacked' ? [4, 4, 0, 0] : [4, 4, 0, 0]}
                        stackId={mode === 'stacked' ? 'a' : undefined}
                    />
                </BarChart>
            </ResponsiveContainer>

            <div className="legend" style={{ marginTop: 8 }}>
                <div className="legend-item">
                    <div className="legend-dot" style={{ background: '#4F46E5' }} /> Entries
                </div>
                <div className="legend-item">
                    <div className="legend-dot" style={{ background: EXITS_SERIES_COLOR }} /> Exits
                </div>
            </div>
        </div>
    );
}
