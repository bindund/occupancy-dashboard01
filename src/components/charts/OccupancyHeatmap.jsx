import React, { useContext } from 'react';
import { HEATMAP_DATA } from '../../data/mockData';
import { ThemeContext } from '../../App';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getColor(val, isDark) {
  if (val === 0) return isDark ? '#21253a' : '#f0f2f8';
  const intensity = Math.min(Math.round(val * 5), 5);
  const dark = ['#1e3a5f', '#1e4d8c', '#1a5bb5', '#1565c0', '#1976d2', '#1e88e5'];
  const light = ['#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb'];
  return isDark ? dark[intensity] : light[intensity];
}

export default function OccupancyHeatmap() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const swatches = [0, 0.1, 0.25, 0.5, 0.7, 0.9, 1.0];

  return (
    <div className="card full-row">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div className="card-title">Occupancy Heatmap</div>
          <div className="card-subtitle">Average people present by hour and day of week</div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>Colour intensity = relative occupancy</div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '3px' }}>
          <thead>
            <tr>
              <th style={{ width: 48, fontSize: 11, color: 'var(--text3)', fontWeight: 500, textAlign: 'left', paddingBottom: 6 }} />
              {DAYS.map(d => (
                <th key={d} style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500, textAlign: 'center', paddingBottom: 6 }}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HEATMAP_DATA.map(row => (
              <tr key={row.hour}>
                <td style={{ fontSize: 11, color: 'var(--text3)', paddingRight: 8, whiteSpace: 'nowrap' }}>
                  {row.hour}
                </td>
                {DAYS.map(day => (
                  <td key={day} style={{ padding: '2px' }}>
                    <div
                      title={`${day} ${row.hour}: ${Math.round(row[day] * 100)}%`}
                      style={{
                        height: 22,
                        borderRadius: 4,
                        background: getColor(row[day], isDark),
                        cursor: 'default',
                        transition: 'opacity 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="heatmap-legend">
        <span>Low</span>
        <div className="heatmap-legend-bar">
          {swatches.map((v, i) => (
            <div
              key={i}
              className="heatmap-legend-swatch"
              style={{ background: getColor(v, isDark) }}
            />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  );
}
