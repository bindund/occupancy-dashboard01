import React, { useContext, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { FORECAST_DATA } from '../../data/mockData';
import { ThemeContext } from '../../App';
import { baseChartOptions } from '../../utils/chartTheme';
import { formatTrendDayLabelIST, formatDateFilterRangeLabel } from '../../utils/istDates';

const GAUGE_MAX = 1500;
const GAUGE_GREEN = '#10B981';

/** Semi-circle donut (Highcharts-style): track + filled slice for peak vs cap. */
function ForecastSemiGauge({ value, theme }) {
  const isDark = theme === 'dark';
  const cap = GAUGE_MAX;
  const v = Math.min(Math.max(value, 0), cap);
  const rest = Math.max(cap - v, 0);
  const track = isDark ? '#2a2f42' : '#e8eaf4';

  const options = useMemo(
    () =>
      baseChartOptions(theme, {
        chart: {
          type: 'pie',
          height: 118,
          backgroundColor: 'transparent',
          margin: [0, 0, 0, 0],
          spacing: [0, 0, 0, 0],
        },
        accessibility: { enabled: false },
        title: { text: undefined },
        credits: { enabled: false },
        tooltip: { enabled: false },
        legend: { enabled: false },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 90,
            innerSize: '72%',
            size: '118%',
            center: ['50%', '100%'],
            borderWidth: 0,
            dataLabels: { enabled: false },
            states: { hover: { enabled: false }, inactive: { enabled: false } },
          },
        },
        series: [
          {
            type: 'pie',
            enableMouseTracking: false,
            data: [
              { name: 'Peak', y: v, color: GAUGE_GREEN },
              { name: 'Track', y: rest, color: track },
            ],
          },
        ],
      }),
    [theme, v, rest, track]
  );

  return (
    <div className="forecast-semi-gauge-host" aria-hidden>
      <HighchartsReact highcharts={Highcharts} options={options} containerProps={{ className: 'forecast-semi-gauge-hc' }} />
    </div>
  );
}

const TEAL_PEAK = '#047857';
const TEAL_HIGHLIGHT = '#0D9488';

function barFill(entry, peakHour, highlightSet, barBg) {
  if (entry.hour === peakHour) return TEAL_PEAK;
  if (highlightSet.has(entry.hour)) return TEAL_HIGHLIGHT;
  return barBg;
}

export default function ForecastCard({ activeTime = 'Today' }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const d = useMemo(() => {
    const m = activeTime === 'Today' ? 1 : activeTime === 'Week' ? 1.05 : 1.1;
    const hM = activeTime === 'Today' ? 1 : activeTime === 'Week' ? 1.04 : 1.08;
    return {
      ...FORECAST_DATA,
      peakForecast: Math.round(FORECAST_DATA.peakForecast * m),
      dailyAverage: Math.round(FORECAST_DATA.dailyAverage * m),
      quietPeak: Math.round(FORECAST_DATA.quietPeak * hM),
      secondaryPeakPpl: Math.round(FORECAST_DATA.secondaryPeakPpl * m),
      vsLastThursday: Math.round(FORECAST_DATA.vsLastThursday * (activeTime === 'Month' ? 0.92 : 1) * 10) / 10,
      hourly: FORECAST_DATA.hourly.map(pt => ({
        ...pt,
        val: Math.round(pt.val * hM),
      })),
    };
  }, [activeTime]);

  const title =
    activeTime === 'Today'
      ? 'FORECAST FOR TODAY'
      : activeTime === 'Week'
        ? 'FORECAST FOR THIS WEEK'
        : 'FORECAST FOR THIS MONTH';
  const subLine =
    activeTime === 'Today'
      ? `${formatTrendDayLabelIST()} · 30-day LSTM model`
      : `${formatDateFilterRangeLabel(activeTime)} · 30-day LSTM model`;

  const peak = d.hourly.reduce((a, b) => (b.val > a.val ? b : a), d.hourly[0]);
  const barBg = isDark ? '#2a2f42' : '#e8eaf4';
  const highlightSet = new Set(d.highlightHours ?? [peak.hour]);

  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-subtitle forecast-card-sub">{subLine}</div>
      <div className="forecast-inner">
        <div className="forecast-top">
          <div className="forecast-gauge-col">
            <ForecastSemiGauge value={d.peakForecast} theme={theme} />
            <div className="forecast-gauge-copy">
              <div className="forecast-gauge-label">
                PEAK FORECAST
                {activeTime === 'Today' ? ' – TODAY' : activeTime === 'Week' ? ' – WEEK' : ' – MONTH'}
              </div>
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
