import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';

export const ThemeContext = React.createContext({ theme: 'dark', toggle: () => {} });

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // Apply .light class to body for global CSS var cascade
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light' : '';
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div className={`app${theme === 'light' ? ' light' : ''}`}>
        <Sidebar />
        <div className="main">
          <Topbar />

          {/* Top-level tabs */}
          <div style={{
            display: 'flex',
            gap: 2,
            padding: '20px 20px 20px 20px',
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
          }}>
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'reports', label: 'Reports' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`tab ${activePage === tab.id ? 'active' : ''}`}
                onClick={() => setActivePage(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activePage === 'dashboard' ? <DashboardPage /> : <ReportsPage />}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
