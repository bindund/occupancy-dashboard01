import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { LEVEL_COLORS } from '../../data/mockData';
import { formatTrendDayLabelIST, formatDateFilterRangeLabel } from '../../utils/istDates';
import { mulberry32 } from '../../utils/seededRandom';
import { datasetSeed } from '../../utils/dashboardScope';

const LEVEL_KEYS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

function formatHour12(h) {
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

function yTicksForMax(yCap) {
  const base = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000];
  const ticks = base.filter(t => t <= yCap);
  if (yCap > 0 && ticks[ticks.length - 1] !== yCap) ticks.push(yCap);
  return ticks.length ? ticks : [0, yCap];
}

function levelValues(rand, base) {
  return {
    L1: Math.round(base * 0.55),
    L2: Math.round(base * 0.28),
    L3: Math.round(base * 0.05),
    L4: Math.round(base * 0.22),
    L5: Math.round(base * 0.14),
    L6: Math.round(base * 0.09),
  };
}

/** @returns {{ data: object[], chart: object, subtitle: string, yTicks: number[] }} */
function trendModel(activeTime, seed) {
  const rand = mulberry32(seed >>> 0);
  const subtitleToday = `All floors · ${formatTrendDayLabelIST()} · 12 AM – 11 PM`;
  const subWeek = `All floors · ${formatDateFilterRangeLabel('Week')} · daily peak`;
  const subMonth = `All floors · ${formatDateFilterRangeLabel('Month')} · weekly rollup`;

  if (activeTime === 'Today') {
    const dayNoise = rand() * 80;
    const data = Array.from({ length: 24 }, (_, hour) => {
      const isDay = hour >= 8 && hour <= 18;
      const base = (isDay ? rand() * 600 + 200 : rand() * 40) + dayNoise * 0.08;
      return { x: hour, ...levelValues(rand, base) };
    });
    const maxLv = Math.max(...data.flatMap(d => LEVEL_KEYS.map(k => d[k])), 1);
    const yCap = Math.max(500, Math.ceil(maxLv / 500) * 500);
    return {
      data,
      chart: {
        xDataKey: 'x',
        type: 'number',
        domain: [0, 23],
        ticks: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 23],
        tickFormatter: formatHour12,
      },
      subtitle: subtitleToday,
      yTicks: yTicksForMax(yCap),
      yMax: yCap,
    };
  }

  if (activeTime === 'Week') {
    const dow = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = dow.map((label, i) => {
      const work = i < 5;
      const base = (work ? rand() * 820 + 220 : rand() * 260 + 50) + rand() * 60;
      return { x: label, ...levelValues(rand, base) };
    });
    const maxLv = Math.max(...data.flatMap(d => LEVEL_KEYS.map(k => d[k])), 1);
    const yCap = Math.max(500, Math.ceil(maxLv / 500) * 500);
    return {
      data,
      chart: {
        xDataKey: 'x',
        type: 'category',
        tickFormatter: v => v,
      },
      subtitle: subWeek,
      yTicks: yTicksForMax(yCap),
      yMax: yCap,
    };
  }

  const data = [1, 2, 3, 4].map(w => {
    const base = rand() * 880 + 240 + w * 12;
    return { x: `W${w}`, ...levelValues(rand, base) };
  });
  const maxLv = Math.max(...data.flatMap(d => LEVEL_KEYS.map(k => d[k])), 1);
  const yCap = Math.max(500, Math.ceil(maxLv / 500) * 500);
  return {
    data,
    chart: {
      xDataKey: 'x',
      type: 'category',
      tickFormatter: v => v,
    },
    subtitle: subMonth,
    yTicks: yTicksForMax(yCap),
    yMax: yCap,
  };
}

function seriesLabel(dataKey) {
  if (typeof dataKey === 'string' && /^L\d+$/.test(dataKey)) return `Floor ${dataKey.slice(1)}`;
  return dataKey;
}

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
          <span>{seriesLabel(p.dataKey)}</span><span>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function OccupancyTrendChart({ activeTime = 'Today' }) {
  const model = useMemo(
    () => trendModel(activeTime, datasetSeed(activeTime)),
    [activeTime],
  );

  return (
    <div className="card occupancy-trend-card">
      <div className="occupancy-trend-head">
        <div>
          <div className="card-title">Occupancy Trend</div>
          <div className="card-subtitle occupancy-trend-sub">{model.subtitle}</div>
        </div>
        <div className="trend-legend">
          {LEVEL_KEYS.map(l => (
            <div key={l} className="legend-item">
              <div className="legend-dot" style={{ background: LEVEL_COLORS[l] }} />
              {`Floor ${l.slice(1)}`}
            </div>
          ))}
        </div>
      </div>

      <div className="occupancy-trend-chart-shell">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            key={activeTime}
            data={model.data}
            margin={{ top: 4, right: 6, left: 4, bottom: 2 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey={model.chart.xDataKey}
              type={model.chart.type}
              {...(model.chart.domain != null
                ? { domain: model.chart.domain, ticks: model.chart.ticks }
                : {})}
              tickFormatter={model.chart.tickFormatter}
              tick={{ fontSize: 9, fill: 'var(--text3)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, model.yMax]}
              ticks={model.yTicks}
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
