import React, { useMemo } from 'react';
import { Users, LogIn, LogOut, TrendingUp } from 'lucide-react';
import { getKpiForFloorAndScope, LEVEL_COLORS } from '../../data/mockData';
import { hexAlpha } from '../../utils/color';

const DEFAULT_ICONS = [
  { icon: Users, bg: 'rgba(79,70,229,0.12)', color: '#4F46E5' },
  { icon: LogIn, bg: 'rgba(6,182,212,0.12)', color: '#06B6D4' },
  { icon: LogOut, bg: 'rgba(6,182,212,0.12)', color: '#06B6D4' },
  { icon: TrendingUp, bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
];

const ICON_COMPONENTS = [Users, LogIn, LogOut, TrendingUp];

function peakPeriodLabel(activeTime) {
  if (activeTime === 'Today') return 'PEAK TODAY';
  if (activeTime === 'Week') return 'PEAK (WEEK)';
  return 'PEAK (MONTH)';
}

const CARDS = [
  { label: 'CURRENT OCCUPANCY', key: 'currentOccupancy', showLive: true },
  { label: 'TOTAL ENTRIES', key: 'totalEntries' },
  { label: 'TOTAL EXITS', key: 'totalExits' },
  { key: 'peakToday', showTime: true, peak: true },
];

export default function KpiCards({ activeFloor = 'All Floors', activeTime = 'Today' }) {
  const icons = useMemo(() => {
    const accent = LEVEL_COLORS[activeFloor];
    if (!accent) return DEFAULT_ICONS;
    return ICON_COMPONENTS.map(Icon => ({
      icon: Icon,
      bg: hexAlpha(accent, 0.14),
      color: accent,
    }));
  }, [activeFloor]);

  const kpi = getKpiForFloorAndScope(activeFloor, activeTime);

  return (
    <div className="kpi-grid">
      {CARDS.map((card, i) => {
        const data = kpi[card.key];
        const cardLabel = card.peak ? peakPeriodLabel(activeTime) : card.label;
        const { icon: Icon, bg, color } = icons[i];
        const isUp = data.change >= 0;
        return (
          <div key={card.key} className="card kpi-card">
            <div className="kpi-label">
              {cardLabel}
              <div className="kpi-icon" style={{ background: bg }}>
                <Icon size={16} color={color} />
              </div>
            </div>
            <div className="kpi-value">
              {data.value.toLocaleString()}
            </div>
            <div className="kpi-footer">
              {card.showLive && (
                <>
                  <span className="status-dot" />
                  <span style={{ color: 'var(--text3)', fontSize: 12 }}>Live</span>
                </>
              )}
              {data.change !== undefined && (
                <span className={`change-badge ${isUp ? 'up' : 'down'}`}>
                  {isUp ? '↗' : '↘'} {Math.abs(data.change)}%
                </span>
              )}
              {card.showTime && (
                <span style={{ color: 'var(--text3)', fontSize: 12 }}>
                  Recorded at {data.time}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
