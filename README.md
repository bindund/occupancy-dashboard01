# Occupancy Dashboard

A pixel-faithful React implementation of the Pinehurst Occupancy Dashboard Figma design.

## Features

- **Dashboard Tab**: KPI cards, forecast gauge, net flow momentum chart, occupancy trend, floor activity, entries vs exits by floor, hour-wise utilization (stacked/grouped), occupancy heatmap
- **Reports Tab**: Monthly/quarterly report generator, recent reports list, summary KPIs
- **Interactive**: Toggle between stacked/grouped chart views, switch floor tabs, time period tabs
- **Live clock** in topbar
- Dark theme matching the Figma design

## Quick Start

```bash
npm install
npm start
```

Runs on http://localhost:3000

## Tech Stack

- React 18
- Recharts (all charts)
- Lucide React (icons)
- DM Sans + DM Mono fonts (Google Fonts)
- Pure CSS (no UI library)

## Project Structure

```
src/
  data/          mockData.js       — all mock data
  components/
    layout/      Sidebar, Topbar
    charts/      ForecastCard, NetFlowChart, OccupancyTrendChart,
                 EntriesExitsChart, HourwiseUtilization, OccupancyHeatmap
    ui/          KpiCards
  pages/         DashboardPage, ReportsPage
  App.jsx
  index.css
  index.js
```
