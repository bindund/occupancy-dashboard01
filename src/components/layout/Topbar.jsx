import React, { useState, useEffect, useContext } from 'react';
import { Sun, Moon, Settings } from 'lucide-react';
import { ThemeContext } from '../../App';

export default function Topbar() {
  const [time, setTime] = useState(new Date());
  const { theme, toggle } = useContext(ThemeContext);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (d) =>
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const fmtDate = (d) =>
    d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="topbar">
      <div className="breadcrumb">
        <span>Pinehurst</span>
        <span className="breadcrumb-sep">/</span>
        <span>Occupancy Dashboard</span>
      </div>
      <div className="topbar-spacer" />
      <div className="topbar-weather">
        <Sun size={14} color="#F59E0B" />
        <span>22.4°C</span>
      </div>
      <span className="topbar-time">{fmt(time)}</span>
      <span className="topbar-date" style={{ color: 'var(--text3)' }}>Bengaluru</span>
      <span className="topbar-date">{fmtDate(time)}</span>

      {/* Theme Toggle */}
      <button className="theme-toggle" onClick={toggle} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      <button className="sidebar-item" style={{ width: 28, height: 28 }}>
        <Settings size={14} />
      </button>
      <div className="topbar-avatar">F</div>
    </div>
  );
}
