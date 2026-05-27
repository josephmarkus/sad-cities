import { useState } from 'react'
import { CITIES } from './data/cities';
import type { Metric, ViewMode } from './utils/chartHelpers';
import Toggle from './components/Toggle';
import CitySelector from './components/CitySelector';
import ComparisonChart from './components/ComparisonChart';

const DEFAULT_IDS = ['london', 'toronto'];

const METRIC_OPTIONS: { label: string; value: Metric }[] = [
  { label: 'Daylight', value: 'daylight' },
  { label: 'Rainfall', value: 'rainfall' },
  { label: 'Temperature', value: 'temperature' },
];

const VIEW_OPTIONS: { label: string; value: ViewMode }[] = [
  { label: 'Absolute', value: 'absolute' },
  { label: 'Deviation', value: 'deviation' },
];

function App() {
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_IDS);
  const [metric, setMetric] = useState<Metric>('daylight');
  const [viewMode, setViewMode] = useState<ViewMode>('absolute');

  const selectedCities = CITIES.filter((c) => selectedIds.includes(c.id));

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">SAD Cities</h1>
        <p className="app-subtitle">
          Compare daylight, rainfall, and temperature through the year for tech hubs across North America and Europe.
        </p>
      </header>

      <main className="app-main">
        <div className="controls">
          <Toggle
            value={metric}
            options={METRIC_OPTIONS}
            onChange={setMetric}
            ariaLabel="Select metric"
          />
          <Toggle
            value={viewMode}
            options={VIEW_OPTIONS}
            onChange={setViewMode}
            ariaLabel="Select view mode"
          />
        </div>

        <ComparisonChart
          selectedCities={selectedCities}
          metric={metric}
          viewMode={viewMode}
        />

        <CitySelector selectedIds={selectedIds} onChange={setSelectedIds} />
      </main>

      <footer className="app-footer">
        <p>
          Rainfall and temperature: WMO Climate Normals 1991–2020 from national
          meteorological services (Met Office, NOAA, Environment Canada, DWD,
          KNMI, SMHI, Météo-France, AEMET, FMI, MET Norway, DMI, IMGW, CHMI, ANM,
          SMN, and others) via{' '}
          <a href="https://www.climate-data.org" target="_blank" rel="noreferrer">
            climate-data.org
          </a>
          .
        </p>
        <p>
          Daylight hours: derived from each city's latitude using the{' '}
          <a
            href="https://gml.noaa.gov/grad/solcalc/"
            target="_blank"
            rel="noreferrer"
          >
            NOAA Solar Calculator
          </a>{' '}
          model.
        </p>
      </footer>
    </div>
  );
}

export default App
