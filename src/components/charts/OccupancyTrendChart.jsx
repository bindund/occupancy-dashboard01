import React, { useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts';
import { LEVEL_COLORS } from '../../data/mockData';

const LEVEL_KEYS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

// Generate simpler daily trend data
const TREND_DATA = (() => {
    const dates = ['Feb 16', 'Feb 17', 'Feb 18', 'Feb 19', 'Feb 20', 'Feb 21', 'Feb 22', 'Feb 23'];
    const result = [];
    dates.forEach(date => {
        for (let h = 0; h < 24; h++) {
            const isDay = h >= 8 && h <= 18;
            const isWeekend = date.includes('22') || date.includes('23');
            const base = isDay && !isWeekend ? Math.random() * 600 + 200 : Math.random() * 40;
            result.push({
                t: `${date.slice(4)} ${String(h).padStart(2, '0')}h`,
                L1: Math.round(base * 0.55),
                L2: Math.round(base * 0.28),
                L3: Math.round(base * 0.05),
                L4: Math.round(base * 0.22),
                L5: Math.round(base * 0.14),
                L6: Math.round(base * 0.09),
            });
        }
    });
    return result;
})();

function maxAcrossSeries(data) {
    let max = 0;
    for (const row of data) {
        for (const k of LEVEL_KEYS) {
            if (row[k] > max) max = row[k];
        }
    }
    return max;
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 12px', fontSize: 11, maxWidth: 160,
        }}>
            <div style={{ color: 'var(--text3)', marginBottom: 4, fontSize: 10 }}>{label}</div>
            {payload.map(p => (
                <div key={p.dataKey} style={{ color: p.color, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span>{p.dataKey}</span><span>{p.value}</span>
                </div>
            ))}
        </div>
    );
};

export default function OccupancyTrendChart() {
    const yMax = useMemo(() => {
        const m = maxAcrossSeries(TREND_DATA);
        const step = 50;
        return Math.max(step, Math.ceil((m * 1.06) / step) * step);
    }, []);

    return (
        <div className="card occupancy-trend-card">
            <div className="occupancy-trend-head">
                <div>
                    <div className="card-title">Occupancy Trend</div>
                    <div className="card-subtitle occupancy-trend-sub">All floors · Last 7 days</div>
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
                    <LineChart data={TREND_DATA} margin={{ top: 4, right: 6, left: -22, bottom: 2 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis
                            dataKey="t"
                            tick={{ fontSize: 9, fill: 'var(--text3)' }}
                            axisLine={false}
                            tickLine={false}
                            interval={23}
                        />
                        <YAxis
                            domain={[0, yMax]}
                            tick={{ fontSize: 9, fill: 'var(--text3)' }}
                            axisLine={false}
                            tickLine={false}
                            width={36}
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
