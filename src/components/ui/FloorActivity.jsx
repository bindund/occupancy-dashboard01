import React, { useMemo } from 'react';
import { FLOOR_ACTIVITY_OVERVIEW, LEVEL_COLORS } from '../../data/mockData';

function levelLabel(levelKey) {
  return `Level ${levelKey.replace('L', '')}`;
}

export default function FloorActivity() {
  const { total, avgPerFloor, maxOcc, rows, avgLinePct } = useMemo(() => {
    const list = FLOOR_ACTIVITY_OVERVIEW.map(row => ({
      ...row,
      color: LEVEL_COLORS[row.levelKey],
      label: levelLabel(row.levelKey),
    }));
    const total = list.reduce((s, r) => s + r.occupancy, 0);
    const maxOcc = Math.max(...list.map(r => r.occupancy), 1);
    const avgPerFloor = Math.round(total / list.length);
    const avgLinePct = (avgPerFloor / maxOcc) * 100;
    const rows = list.map(r => ({
      ...r,
      barPct: (r.occupancy / maxOcc) * 100,
      sharePct: total > 0 ? (100 * r.occupancy) / total : 0,
    }));
    return { total, avgPerFloor, maxOcc, rows, avgLinePct };
  }, []);

  return (
    <div className="card floor-activity-card">
      <div className="floor-activity-head">
        <div>
          <div className="card-title">Floor Activity Overview</div>
          <div className="card-subtitle floor-activity-sub">Comparative occupancy distribution</div>
        </div>
        <div className="floor-activity-kpis">
          <div className="floor-activity-kpi">
            <span className="floor-activity-kpi-label">TOTAL</span>
            <span className="floor-activity-kpi-val">{total.toLocaleString()}</span>
          </div>
          <div className="floor-activity-kpi">
            <span className="floor-activity-kpi-label">AVG/FLOOR</span>
            <span className="floor-activity-kpi-val">{avgPerFloor.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="floor-activity-rows" role="list">
        {rows.map(r => (
          <div key={r.levelKey} className="floor-activity-row" role="listitem">
            <div className="floor-activity-row-left">
              <span className="floor-activity-dot" style={{ background: r.color }} aria-hidden />
              <span className="floor-activity-level-name">{r.label}</span>
              <span className="floor-activity-trend">↗ {r.changePct.toFixed(1)}%</span>
            </div>
            <div className="floor-activity-bar-cell">
              <div className="floor-activity-track" aria-hidden>
                <div
                  className="floor-activity-fill"
                  style={{ width: `${r.barPct}%`, backgroundColor: r.color }}
                />
                <div
                  className="floor-activity-avg-line"
                  style={{ left: `${avgLinePct}%` }}
                />
              </div>
            </div>
            <div className="floor-activity-row-right">
              <span className="floor-activity-count">{r.occupancy.toLocaleString()} people</span>
              <span className="floor-activity-share"> ({r.sharePct.toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>

      <div className="floor-activity-foot">
        <div className="floor-activity-legend">
          <span className="floor-activity-legend-item">
            <span className="floor-activity-leg-avg-icon" aria-hidden />
            Average line
          </span>
          <span className="floor-activity-legend-item">
            <span className="floor-activity-leg-bar-icon" aria-hidden />
            Bar relative to highest floor
          </span>
        </div>
        <div className="floor-activity-highest">
          Highest: <strong>{maxOcc.toLocaleString()} people</strong>
        </div>
      </div>
    </div>
  );
}
