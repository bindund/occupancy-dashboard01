import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FLOOR_ACTIVITY } from '../../data/mockData';

export default function FloorActivity() {
  const maxVal = Math.max(...FLOOR_ACTIVITY.map(f => f.value));
  const top3 = FLOOR_ACTIVITY.slice(0, 3);

  return (
    <div className="card floor-activity-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <div className="card-title">Floor Activity</div>
        <div style={{ display: 'flex', gap: 2 }}>
          <button className="btn-sm" style={{ padding: '3px 6px' }}><ChevronLeft size={12} /></button>
          <button className="btn-sm" style={{ padding: '3px 6px' }}><ChevronRight size={12} /></button>
        </div>
      </div>
      <div className="card-subtitle">Relative occupancy across floors</div>
      <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 10 }}>Showing 1–3 of 6</div>

      {/* Top 3 mini cards */}
      <div className="floor-cards-row">
        {top3.map(floor => (
          <div key={floor.level} className="floor-mini-card">
            <div className="floor-mini-label" style={{ color: floor.color }}>
              {floor.level}
            </div>
            <div className="floor-mini-val">{floor.value.toLocaleString()}</div>
            <div className="change-badge up" style={{ fontSize: 11 }}>
              ↗ {floor.change}%
            </div>
          </div>
        ))}
      </div>

      {/* All floors bars */}
      <div className="floor-bar-section">
        <label>ALL FLOORS</label>
        {FLOOR_ACTIVITY.map(floor => (
          <div key={floor.level} className="floor-bar-row">
            <span>{floor.level}</span>
            <div className="floor-bar-track">
              <div
                className="floor-bar-fill"
                style={{
                  width: `${(floor.value / maxVal) * 100}%`,
                  background: floor.color,
                }}
              />
            </div>
            <span>{floor.value.toLocaleString()} people</span>
          </div>
        ))}
        <div className="floor-bar-note">Bar width = relative to busiest floor</div>
      </div>
    </div>
  );
}
