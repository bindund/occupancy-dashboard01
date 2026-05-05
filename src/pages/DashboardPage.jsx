import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import KpiCards from '../components/ui/KpiCards';
import ForecastCard from '../components/charts/ForecastCard';
import OccupancyTrendChart from '../components/charts/OccupancyTrendChart';
import FloorActivity from '../components/ui/FloorActivity';
import EntriesExitsChart from '../components/charts/EntriesExitsChart';
import HourwiseUtilization from '../components/charts/HourwiseUtilization';
import OccupancyHeatmap from '../components/charts/OccupancyHeatmap';
import FloorLevelView from '../components/floor/FloorLevelView';

const FLOOR_TABS = ['All Floors', 'Level 1', 'Level 2', 'Level 3'];
const TIME_TABS = ['Today', 'Week', 'Month'];

export default function DashboardPage() {
    const [activeFloor, setActiveFloor] = useState('All Floors');
    const [activeTime, setActiveTime] = useState('Week');
    const isAllFloors = activeFloor === 'All Floors';

    return (
        <div className="content">
            {/* Tab Bar */}
            <div className="tab-bar">
                <div className="tabs-right" style={{ marginLeft: 0, marginRight: 'auto', gap: 8 }}>
                    {FLOOR_TABS.map(t => (
                        <button
                            key={t}
                            className={`tab ${activeFloor === t ? 'active' : ''}`}
                            onClick={() => setActiveFloor(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {TIME_TABS.map(t => (
                        <button
                            key={t}
                            className={`tab ${activeTime === t ? 'active' : ''}`}
                            onClick={() => setActiveTime(t)}
                        >
                            {t}
                        </button>
                    ))}
                    <div className="date-badge">
                        <Calendar size={12} />
                        16 Feb – 23 Feb 2026
                    </div>
                </div>
            </div>

            {/* KPI Row — values & accents follow selected floor */}
            <KpiCards activeFloor={activeFloor} />

            {isAllFloors ? (
                <>
                    <div className="mid-grid">
                        <ForecastCard />
                    </div>

                    <div className="bottom-grid">
                        <OccupancyTrendChart />
                        <FloorActivity />
                    </div>

                    <EntriesExitsChart />
                    <HourwiseUtilization />
                    <OccupancyHeatmap />
                </>
            ) : (
                <FloorLevelView floor={activeFloor} />
            )}
        </div>
    );
}
