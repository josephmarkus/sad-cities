import { useState } from 'react'
import { CITIES } from './data/cities';
import type { Metric, ViewMode } from './utils/chartHelpers';
import { DAY_VIEW_UNITS } from './utils/chartHelpers';
import { todayDoy } from './utils/solar';
import Toggle from './components/Toggle';
import CityChips from './components/CityChips';
import ComparisonChart from './components/ComparisonChart';
import RankingsTable from './components/RankingsTable';
import DayComparison from './components/DayComparison';
import YearView from './components/YearView';
import MonthTable from './components/MonthTable';

const DEFAULT_IDS = ['london', 'toronto'];

const METRIC_OPTIONS: { label: string; value: Metric }[] = [
  { label: 'Sunlight', value: 'sunlight' },
  { label: 'Daylight', value: 'daylight' },
  { label: 'Rainfall', value: 'rainfall' },
  { label: 'Temperature', value: 'temperature' },
];

const DAY_METRIC_OPTIONS: { label: string; value: Metric }[] = [
  { label: 'Sun', value: 'sunlight' },
  { label: 'Daylight', value: 'daylight' },
  { label: 'Temp', value: 'temperature' },
  { label: 'Rain', value: 'rainfall' },
];

const VIEW_OPTIONS: { label: string; value: ViewMode }[] = [
  { label: 'Absolute', value: 'absolute' },
  { label: 'Deviation', value: 'deviation' },
];

const TODAY = todayDoy();

function App() {
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_IDS);
  const [metric, setMetric] = useState<Metric>('sunlight');
  const [viewMode, setViewMode] = useState<ViewMode>('absolute');

  // Day comparison state
  const [doy, setDoy] = useState(TODAY);
  const [baseId, setBaseId] = useState(DEFAULT_IDS[0]);
  const [dayMetric, setDayMetric] = useState<Metric>('sunlight');

  const selectedCities = CITIES.filter((c) => selectedIds.includes(c.id));

  // The base city is what every other city is compared against. If it gets
  // deselected, fall back to the first remaining city.
  const effectiveBaseId = selectedIds.includes(baseId) ? baseId : selectedIds[0] ?? '';
  const dayCities = [
    ...selectedCities.filter((c) => c.id === effectiveBaseId),
    ...selectedCities.filter((c) => c.id !== effectiveBaseId),
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">SAD Cities</h1>
        <p className="app-subtitle">
          Compare daylight, rainfall, and temperature through the year for tech hubs across North America and Europe.
        </p>
      </header>

      <main className="app-main">
        <DayComparison
          cities={dayCities}
          baseId={effectiveBaseId}
          chips={
            <CityChips
              selectedIds={selectedIds}
              onChange={setSelectedIds}
              baseId={effectiveBaseId}
              onBaseChange={setBaseId}
              doy={doy}
            />
          }
          doy={doy}
          today={TODAY}
          onDoyChange={setDoy}
        />

        {dayCities.length > 0 && (
          <>
            <section className="section" aria-labelledby="year-title">
              <div className="section-head">
                <h2 id="year-title" className="section-title">Year view</h2>
                <Toggle value={dayMetric} options={DAY_METRIC_OPTIONS} onChange={setDayMetric} ariaLabel="Select metric" />
              </div>
              <div className="panel">
                <YearView
                  cities={dayCities}
                  baseId={effectiveBaseId}
                  metric={dayMetric}
                  doy={doy}
                  today={TODAY}
                  onDoyChange={setDoy}
                />
              </div>
            </section>

            <section className="section" aria-labelledby="month-title">
              <div className="section-head section-head--stacked">
                <h2 id="month-title" className="section-title">Month by month</h2>
                <span className="section-sub">{DAY_VIEW_UNITS[dayMetric]}</span>
              </div>
              <div className="panel">
                <MonthTable cities={dayCities} metric={dayMetric} doy={doy} onDoyChange={setDoy} />
              </div>
            </section>
          </>
        )}

        <section className="section" aria-labelledby="overview-title">
          <div className="section-head">
            <h2 id="overview-title" className="section-title">Monthly averages</h2>
          </div>
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

          <div className="panel">
            <ComparisonChart
              selectedCities={selectedCities}
              metric={metric}
              viewMode={viewMode}
            />
          </div>
        </section>

        <section className="section" aria-labelledby="rankings-title">
          <h2 id="rankings-title" className="section-title">Rankings</h2>
          <div className="panel">
            <RankingsTable metric={metric} selectedIds={selectedIds} />
          </div>
        </section>
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
          Sunlight hours: mean daily sunshine hours from WMO Climate Normals
          (1991–2020 where available), sourced from Wikipedia climate infoboxes
          citing national meteorological services. Day view values are typical
          for the date (monthly normals smoothed to a daily curve), not a forecast.
        </p>
        <p>
          Daylight hours, sunrise and sunset: computed from each city's
          coordinates using the{' '}
          <a
            href="https://gml.noaa.gov/grad/solcalc/"
            target="_blank"
            rel="noreferrer"
          >
            NOAA Solar Calculator
          </a>{' '}
          model, shown in each city's local time.
        </p>
      </footer>
    </div>
  );
}

export default App
