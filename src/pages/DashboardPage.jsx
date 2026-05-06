import React, { useMemo, useRef, useState } from 'react';
import { Calendar } from 'lucide-react';
import KpiCards from '../components/ui/KpiCards';
import ForecastCard from '../components/charts/ForecastCard';
import OccupancyTrendChart from '../components/charts/OccupancyTrendChart';
import FloorActivity from '../components/ui/FloorActivity';
import EntriesExitsChart from '../components/charts/EntriesExitsChart';
import HourwiseUtilization from '../components/charts/HourwiseUtilization';
import OccupancyHeatmap from '../components/charts/OccupancyHeatmap';
import FloorLevelView from '../components/floor/FloorLevelView';
import {
    formatDateFilterRangeLabel,
    formatHeatmap30DayWindowLabel,
    istYmd,
    ymdFromHtmlDateValue,
    ymdToHtmlDateValue,
} from '../utils/istDates';

const FLOOR_TABS = ['All Floors', 'Floor 1', 'Floor 2', 'Floor 3'];
const TIME_TABS = ['Today', 'Week', 'Month'];

export default function DashboardPage() {
    const [activeFloor, setActiveFloor] = useState('All Floors');
    const [activeTime, setActiveTime] = useState('Week');
    const [heatmapStartYmd, setHeatmapStartYmd] = useState(() => istYmd(new Date()));
    const heatmapDateInputRef = useRef(null);
    const isAllFloors = activeFloor === 'All Floors';
    const dateFilterLabel = useMemo(
        () => formatDateFilterRangeLabel(activeTime),
        [activeTime],
    );

    const openHeatmapDatePicker = () => {
        const el = heatmapDateInputRef.current;
        if (!el) return;
        if (typeof el.showPicker === 'function') {
            try {
                el.showPicker();
            } catch {
                el.click();
            }
        } else {
            el.click();
        }
    };

    return (
        <div className="content">
            {/* Tab Bar */}
            <div className="tab-bar tab-bar-dashboard">
                <div className="tab-bar-floors">
                    {FLOOR_TABS.map(t => (
                        <button
                            key={t}
                            type="button"
                            className={`tab ${activeFloor === t ? 'active' : ''}`}
                            onClick={() => setActiveFloor(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <div className="tab-bar-scope">
                    {TIME_TABS.map(t => (
                        <button
                            key={t}
                            type="button"
                            className={`tab ${activeTime === t ? 'active' : ''}`}
                            aria-pressed={activeTime === t}
                            onClick={() => setActiveTime(t)}
                        >
                            {t}
                        </button>
                    ))}
                    <div className="date-badge-cluster">
                        <div className="date-badge date-badge--readonly" aria-label="Dashboard time scope">
                            <Calendar size={12} aria-hidden />
                            {dateFilterLabel}
                        </div>
                        <input
                            ref={heatmapDateInputRef}
                            type="date"
                            value={ymdToHtmlDateValue(heatmapStartYmd)}
                            onChange={(e) => {
                                const next = ymdFromHtmlDateValue(e.target.value);
                                if (next) setHeatmapStartYmd(next);
                            }}
                            aria-hidden
                            tabIndex={-1}
                            style={{
                                position: 'absolute',
                                width: 1,
                                height: 1,
                                opacity: 0,
                                pointerEvents: 'none',
                            }}
                        />
                        <button
                            type="button"
                            className="date-badge"
                            onClick={openHeatmapDatePicker}
                            title="Choose IST start date for the 30-day occupancy heatmap. Does not follow Today / Week / Month."
                        >
                            <Calendar size={12} aria-hidden />
                            <span>{formatHeatmap30DayWindowLabel(heatmapStartYmd)}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Row — values & accents follow selected floor */}
            <KpiCards activeFloor={activeFloor} activeTime={activeTime} />

            {isAllFloors ? (
                <>
                    <div className="mid-grid">
                        <ForecastCard activeTime={activeTime} />
                    </div>

                    <div className="bottom-grid">
                        <OccupancyTrendChart activeTime={activeTime} />
                        <FloorActivity activeTime={activeTime} />
                    </div>

                    <EntriesExitsChart activeTime={activeTime} />
                    <HourwiseUtilization activeTime={activeTime} />
                    <OccupancyHeatmap heatmapStartYmd={heatmapStartYmd} />
                </>
            ) : (
                <FloorLevelView floor={activeFloor} activeTime={activeTime} />
            )}
        </div>
    );
}
