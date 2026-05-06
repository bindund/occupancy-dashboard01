import React, { useContext, useMemo } from 'react';
import { ThemeContext } from '../../App';
import {
  buildHeatmapCalendarGridModel,
  HEATMAP_CAL_COL_LABELS,
  heatmapCellFillColor01,
  heatmapLegendGradient,
} from '../../utils/heatmap30';
import { formatHeatmapCalendarSpanLabel } from '../../utils/istDates';

/**
 * Calendar-style heatmap (reference layout): IST weeks as rows Sun→Sat,
 * left = week start DD Mon, cells = padded day corner + centred 0–10 score,
 * column labels SUN…SAT along the bottom, vertical 0–10 scale on the right.
 */
export default function OccupancyHeatmap({ heatmapStartYmd, heatmapEndYmd }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const { rowLeftLabels, grid } = useMemo(
    () => buildHeatmapCalendarGridModel(heatmapStartYmd, heatmapEndYmd),
    [heatmapStartYmd.y, heatmapStartYmd.m, heatmapStartYmd.d, heatmapEndYmd.y, heatmapEndYmd.m, heatmapEndYmd.d],
  );

  const windowLine = formatHeatmapCalendarSpanLabel(heatmapStartYmd, heatmapEndYmd);

  const scaleCss = heatmapLegendGradient(isDark);

  return (
    <div className="card full-row occupancy-heatmap-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div className="card-title">Occupancy Heatmap</div>
          <div className="card-subtitle">
            Same calendar day last month through end date (IST){windowLine ? ` · ${windowLine}` : ''} · unaffected by Today / Week / Month
          </div>
        </div>
      </div>

      <div className="occupancy-cal-wrap">
        <div className="occupancy-heatmap-scroll occupancy-cal-scroll">
          <table className="occupancy-heatmap-table occupancy-cal-table">
            <tbody>
              {grid.map((row, ri) => (
                <tr key={rowLeftLabels[ri] ?? ri}>
                  <th scope="row" className="occupancy-cal-row-label">
                    {rowLeftLabels[ri]}
                  </th>
                  {row.map(cell => (
                    <td key={cell.key} className="occupancy-cal-td">
                      {cell.empty ? (
                        <div
                          className="occupancy-cal-cell occupancy-cal-cell--empty"
                          style={{ background: heatmapCellFillColor01(0, true, isDark) }}
                          aria-hidden
                        />
                      ) : (
                        <div
                          className="occupancy-cal-cell"
                          style={{
                            background: heatmapCellFillColor01(cell.rawAvg, false, isDark),
                          }}
                          title={`${cell.tooltipLine1} — ${cell.tooltipLine2}`}
                        >
                          <span className="occupancy-cal-day">{cell.dayPadded}</span>
                          <span className="occupancy-cal-value">{cell.score0to10}</span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th className="occupancy-cal-corner" scope="colgroup" aria-hidden />
                {HEATMAP_CAL_COL_LABELS.map(lab => (
                  <th key={lab} scope="col" className="occupancy-cal-axis">
                    {lab}
                  </th>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <aside className="occupancy-cal-scale" aria-label="Occupancy intensity 0 to 10">
          <span className="occupancy-cal-scale-max">10</span>
          <div
            className="occupancy-cal-scale-bar"
            style={{ background: scaleCss }}
          />
          <span className="occupancy-cal-scale-min">0</span>
        </aside>
      </div>
    </div>
  );
}
