import React from 'react';
import {
  LayoutDashboard, Building2, Home, Bell, Users,
  Monitor, Activity, TrendingUp, Settings, HelpCircle
} from 'lucide-react';

const NAV = [
  { icon: LayoutDashboard, id: 'dashboard' },
  { icon: Building2, id: 'building' },
  { icon: Home, id: 'home' },
  { icon: Bell, id: 'alerts' },
  { icon: Users, id: 'people', active: true },
  { icon: Monitor, id: 'monitor' },
  { icon: Activity, id: 'activity' },
  { icon: TrendingUp, id: 'trends' },
  { icon: Settings, id: 'settings' },
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">🏢</div>
      {NAV.map(({ icon: Icon, id, active }) => (
        <button key={id} className={`sidebar-item ${active ? 'active' : ''}`}>
          <Icon size={18} />
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <button className="sidebar-item">
        <HelpCircle size={18} />
      </button>
    </div>
  );
}
