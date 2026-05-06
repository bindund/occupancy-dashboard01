import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, BarChart2 } from 'lucide-react';
import { RECENT_REPORTS } from '../data/mockData';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** True when this calendar month is after "today" for the chosen reporting year (not yet completable). */
function isFutureReportingMonth(yearStr, monthName) {
  const today = new Date();
  const y = parseInt(yearStr, 10);
  if (Number.isNaN(y)) return false;
  const cy = today.getFullYear();
  const cm = today.getMonth();
  const idx = MONTH_NAMES.indexOf(monthName);
  if (idx < 0) return false;
  if (y > cy) return true;
  if (y < cy) return false;
  return idx > cm;
}

export default function ReportsPage() {
  const [subTab, setSubTab] = useState('Monthly Reports');
  const [year, setYear] = useState('2026');
  const [month, setMonth] = useState('');
  const canGenerate = Boolean(month) && !isFutureReportingMonth(year, month);

  useEffect(() => {
    setMonth(m => (m && isFutureReportingMonth(year, m) ? '' : m));
  }, [year]);

  return (
    <div className="content">
      {/* Sub tabs */}
      <div className="sub-tabs">
        {['Monthly Reports', 'Quarterly Reports'].map(t => (
          <button
            key={t}
            className={`sub-tab ${subTab === t ? 'active' : ''}`}
            onClick={() => setSubTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Report Generator */}
      <div className="report-card">
        <div className="report-header">
          <div className="report-icon">
            <FileText size={18} />
          </div>
          <div>
            <div className="card-title">Monthly Occupancy Report</div>
            <div className="card-subtitle" style={{ marginBottom: 0 }}>
              Configure parameters and generate monthly occupancy performance analysis
            </div>
          </div>
        </div>

        <div className="form-row report-form-row">
          <div className="form-group">
            <label htmlFor="report-year">Reporting year</label>
            <select id="report-year" className="form-select" value={year} onChange={e => setYear(e.target.value)}>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="report-month">Reporting month</label>
            <select id="report-month" className="form-select" value={month} onChange={e => setMonth(e.target.value)}>
              <option value="">Select month…</option>
              {MONTH_NAMES.map(m => {
                const disabled = isFutureReportingMonth(year, m);
                return (
                  <option key={m} value={m} disabled={disabled} title={disabled ? 'Future month — not available yet' : undefined}>
                    {m}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group">
            {/* <span className="form-group-label" id="report-status-label">Report status</span> */}
            {/* <div
              className={`report-status-box${canGenerate ? ' report-status-box--ready' : ''}`}
              role="status"
              aria-labelledby="report-status-label"
            >
              {canGenerate ? (
                <>Ready — <strong>{month} {year}</strong></>
              ) : (
                <>
                  Choose a month to enable PDF generation (demo).
                  <span className="report-status-hint"> Months after today are disabled for the current year.</span>
                </>
              )}
            </div> */}
          </div>
        </div>

        <button
          type="button"
          className={`btn-generate${canGenerate ? ' btn-generate--ready' : ''}`}
          disabled={!canGenerate}
          onClick={() => canGenerate && window.alert(`Demo: would generate ${month} ${year} occupancy report.`)}
        >
          <Download size={14} aria-hidden />
          {canGenerate ? `Generate report (${month} ${year})` : 'Generate report'}
        </button>
      </div>

      {/* Recent Reports */}
      <div className="report-card">
        <div className="recent-reports-header">
          <div className="card-title">Recent Reports</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>Last 30 days</div>
        </div>

        {RECENT_REPORTS.map((r, i) => (
          <div key={i} className="report-list-item">
            <div className="report-file-icon">
              <FileText size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="report-list-name">{r.name}</div>
              <div className="report-list-meta">Generated on {r.date} · {r.size}</div>
            </div>
            <button className="btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Download size={12} /> Download
            </button>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="report-kpi-grid">
        {[
          { label: 'Total Reports', value: '47', icon: FileText, bg: 'rgba(79,70,229,0.12)', color: '#4F46E5' },
          { label: 'This Month', value: '3', icon: Calendar, bg: 'rgba(6,182,212,0.12)', color: '#06B6D4' },
          { label: 'This Quarter', value: '8', icon: BarChart2, bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
          { label: 'Last Generated', value: '2 days ago', icon: Download, bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="report-kpi">
            <div className="report-kpi-icon" style={{ background: bg }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div className="report-kpi-val">{value}</div>
              <div className="report-kpi-label">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
