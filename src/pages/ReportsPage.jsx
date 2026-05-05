import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart2 } from 'lucide-react';
import { RECENT_REPORTS } from '../data/mockData';

export default function ReportsPage() {
  const [subTab, setSubTab] = useState('Monthly Reports');
  const [year, setYear] = useState('2026');
  const [month, setMonth] = useState('');

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

        <div className="form-row">
          <div className="form-group">
            <label>REPORTING YEAR</label>
            <select className="form-select" value={year} onChange={e => setYear(e.target.value)}>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div className="form-group">
            <label>REPORTING MONTH</label>
            <select className="form-select" value={month} onChange={e => setMonth(e.target.value)}>
              <option value="">Select Month</option>
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>REPORT STATUS</label>
            <select className="form-select">
              <option>Current Period – Not Available</option>
              <option>Available</option>
            </select>
          </div>
        </div>

        <button className="btn-generate">
          <Download size={14} />
          Generate Report – Not Available
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
