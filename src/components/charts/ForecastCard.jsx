import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { FORECAST_DATA } from '../../data/mockData';
import { ThemeContext } from '../../App';

function Gauge({ value, max = 1500, isDark }) {
  const pct = Math.min(value / max, 1);
  const angle = pct * 180 - 90;
  const rad = (angle * Math.PI) / 180;
  const cx = 60, cy = 60, r = 50;

  const describeArc = (startDeg, endDeg) => {
    const s = ((startDeg - 90) * Math.PI) / 180;
    const e = ((endDeg - 90) * Math.PI) / 180;
    const sx = cx + r * Math.cos(s), sy = cy + r * Math.sin(s);
    const ex = cx + r * Math.cos(e), ey = cy + r * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
  };

  const trackColor = isDark ? '#2a2f42' : '#e2e5f0';
  const labelColor = isDark ? '#545d82' : '#9399b8';

  return (
    <svg viewBox="0 0 120 70" width="120" height="70">
      <path d={describeArc(0, 180)} fill="none" stroke={trackColor} strokeWidth="8" strokeLinecap="round" />
      <path d={describeArc(0, pct * 180)} fill="none" stroke="#10B981" strokeWidth="8" strokeLinecap="round" />
      <circle cx={cx + r * Math.cos(rad)} cy={cy + r * Math.sin(rad)} r="5" fill="#10B981" />
      {/* <text x={cx - r - 2} y={cy + 14} fontSize="9" fill={labelColor}>0</text>
      <text x={cx + r - 12} y={cy + 14} fontSize="9" fill={labelColor}>{max}</text> */}
    </svg>
  );
}

const TEAL_PEAK = '#047857';
const TEAL_HIGHLIGHT = '#0D9488';

function barFill(entry, peakHour, highlightSet, barBg) {
  if (entry.hour === peakHour) return TEAL_PEAK;
  if (highlightSet.has(entry.hour)) return TEAL_HIGHLIGHT;
  return barBg;
}

export default function ForecastCard() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const d = FORECAST_DATA;
  const peak = d.hourly.reduce((a, b) => (b.val > a.val ? b : a), d.hourly[0]);
  const barBg = isDark ? '#2a2f42' : '#e8eaf4';
  const highlightSet = new Set(d.highlightHours ?? [peak.hour]);

  return (
    <div className="card">
      <div className="card-title">FORECAST FOR TODAY</div>
      <div className="card-subtitle forecast-card-sub">
        Thu 26 Feb – 30-day LSTM Model
      </div>
      <div className="forecast-inner">
        <div className="forecast-top">
          <div className="forecast-gauge-col">
            <Gauge value={d.peakForecast} isDark={isDark} />
            <div className="forecast-gauge-copy">
              <div className="forecast-gauge-label">PEAK FORECAST – TODAY</div>
              <div className="forecast-value">{d.peakForecast.toLocaleString()}</div>
              <div className="forecast-meta">{d.window} · {d.confidence}% confidence</div>
            </div>
          </div>

          <div className="forecast-stats-grid">
            <div className="stat-block forecast-stat forecast-stat--vs">
              <label>VS LAST THURSDAY</label>
              <div className="val green">+{d.vsLastThursday}%</div>
              <div className="sub">~100 people</div>
            </div>
            <div className="stat-block forecast-stat forecast-stat--quiet">
              <label>QUIET WINDOW</label>
              <div className="val">{d.quietWindow}</div>
              <div className="sub">~{d.quietPeak} peak</div>
            </div>
            <div className="stat-block forecast-stat forecast-stat--daily">
              <label>DAILY AVERAGE</label>
              <div className="val">{d.dailyAverage}</div>
              <div className="sub">All floors</div>
            </div>
            <div className="stat-block forecast-stat forecast-stat--secondary">
              <label>SECONDARY PEAK</label>
              <div className="val">{d.secondaryPeak}</div>
              <div className="sub">~{d.secondaryPeakPpl} ppl</div>
            </div>
          </div>
        </div>

        <div className="forecast-hourly-block">
          <div className="forecast-bar-label">HOURLY FORECAST</div>
          <div className="forecast-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={d.hourly}
                barCategoryGap="12%"
                margin={{ top: 6, right: 4, left: 4, bottom: 2 }}
              >
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 9, fill: 'var(--text3)' }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <Bar dataKey="val" radius={[3, 3, 0, 0]}>
                  {d.hourly.map((entry, i) => (
                    <Cell key={i} fill={barFill(entry, peak.hour, highlightSet, barBg)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
