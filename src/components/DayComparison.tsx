import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { City } from '../data/cities';
import { getColor } from '../utils/colors';
import {
  cityYear,
  doyToIso,
  formatDelta,
  formatDuration,
  formatDurationDelta,
  isoToDoy,
  localHours,
  localTime,
  sunTimes,
  YEAR,
} from '../utils/solar';
import type { SunTimes } from '../utils/solar';

interface DayComparisonProps {
  /** Selected cities, base city first */
  cities: City[];
  baseId: string;
  onBaseChange: (id: string) => void;
  doy: number;
  today: number;
  onDoyChange: (doy: number) => void;
}

/** Re-render once a minute so the "now" marker on today's ribbons moves. */
function useMinuteTick(enabled: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, [enabled]);
  return now;
}

export default function DayComparison({
  cities,
  baseId,
  onBaseChange,
  doy,
  today,
  onDoyChange,
}: DayComparisonProps) {
  const isToday = doy === today;
  const now = useMinuteTick(isToday);
  const base = cities.find((c) => c.id === baseId);
  const selectedIds = cities.map((c) => c.id);

  return (
    <section className="day" aria-labelledby="day-title">
      <h2 id="day-title" className="visually-hidden">Day view</h2>

      <div className="day-bar">
        <input
          type="date"
          className="day-date"
          aria-label="Day to compare"
          value={doyToIso(doy)}
          min={`${YEAR}-01-01`}
          max={`${YEAR}-12-31`}
          onChange={(e) => {
            const d = isoToDoy(e.target.value);
            if (d !== null) onDoyChange(d);
          }}
        />
        <button className="pill-btn" onClick={() => onDoyChange(today)} aria-pressed={isToday}>
          Today
        </button>
      </div>

      {cities.length > 1 && (
        <div className="day-base" role="group" aria-label="Compare against">
          {cities.map((c) => (
            <button
              key={c.id}
              className={`pill-btn day-base-btn${c.id === baseId ? ' day-base-btn--active' : ''}`}
              aria-pressed={c.id === baseId}
              onClick={() => onBaseChange(c.id)}
            >
              <span className="dot" style={{ background: getColor(c.id, selectedIds) }} />
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="ribbon-legend" aria-hidden="true">
        <span><i style={{ background: 'var(--night)' }} />Night</span>
        <span><i style={{ background: 'var(--day)' }} />Daylight</span>
        <span><i style={{ background: 'var(--sun)' }} />Sunshine</span>
      </div>

      {cities.length === 0 ? (
        <p className="chart-empty">Pick a city below to see its day.</p>
      ) : (
        <div className="day-cards">
          {cities.map((city) => (
            <DayCard
              key={city.id}
              city={city}
              base={city.id === baseId ? undefined : base}
              doy={doy}
              now={isToday ? now : undefined}
              selectedIds={selectedIds}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface DayCardProps {
  city: City;
  /** City to show differences against; omitted for the base city itself */
  base?: City;
  doy: number;
  /** Current time, only when the selected day is today */
  now?: number;
  selectedIds: string[];
}

function DayCard({ city, base, doy, now, selectedIds }: DayCardProps) {
  const year = cityYear(city);
  const times = sunTimes(doy, city.lat, city.lon);
  const sun = year.sunlight[doy];
  const daylight = year.daylight[doy];
  const temp = year.temperature[doy];
  const baseYear = base ? cityYear(base) : undefined;
  const [hours, minutes] = formatDuration(daylight).split(' ');

  return (
    <article className="day-card">
      <div className="day-card-head">
        <span className="day-card-name">
          <span className="dot" style={{ background: getColor(city.id, selectedIds) }} />
          {city.name}
        </span>
        {now !== undefined && <span className="day-card-now">{localTime(now, city.timeZone)}</span>}
      </div>

      <div className="day-stats">
        <Stat label="Sun" className="day-stat--sun" delta={baseYear && formatDelta(sun - baseYear.sunlight[doy], 'h')}>
          {sun.toFixed(1)}<small>h</small>
        </Stat>
        <Stat label="Daylight" delta={baseYear && formatDurationDelta(daylight - baseYear.daylight[doy])}>
          {hours.slice(0, -1)}<small>h</small> {minutes.slice(0, -1)}<small>m</small>
        </Stat>
        <Stat label="Temp" delta={baseYear && formatDelta(temp - baseYear.temperature[doy], '°', 0)}>
          {Math.round(temp)}<small>°C</small>
        </Stat>
      </div>

      <DayRibbon times={times} sunHours={sun} timeZone={city.timeZone} now={now} />
    </article>
  );
}

function Stat({
  label,
  delta,
  className = '',
  children,
}: {
  label: string;
  delta?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`day-stat ${className}`}>
      <span className="day-stat-label">{label}</span>
      <span className="day-stat-value">{children}</span>
      {delta && <span className="day-stat-delta">{delta}</span>}
    </div>
  );
}

/**
 * A 24-hour strip in the city's local time: night, daylight, and the typical
 * hours of sunshine drawn as one block around solar noon.
 */
function DayRibbon({
  times,
  sunHours,
  timeZone,
  now,
}: {
  times: SunTimes;
  sunHours: number;
  timeZone: string;
  now?: number;
}) {
  const W = 340;
  const H = 46;
  const top = 4;
  const bh = 22;
  const x = (h: number) => (Math.max(0, Math.min(24, h)) / 24) * W;

  const rise = localHours(times.sunrise, timeZone);
  const set = localHours(times.sunset, timeZone);
  const noon = localHours(times.solarNoon, timeZone);

  // Centre the sunshine block on solar noon, keeping it inside daylight.
  let s0 = noon - sunHours / 2;
  let s1 = noon + sunHours / 2;
  if (s0 < rise) { s1 += rise - s0; s0 = rise; }
  if (s1 > set) { s0 -= s1 - set; s1 = set; }
  s0 = Math.max(rise, s0);

  const riseLabel = localTime(times.sunrise, timeZone);
  const setLabel = localTime(times.sunset, timeZone);
  const nowX = now !== undefined ? x(localHours(now, timeZone)) : undefined;

  return (
    <svg
      className="day-ribbon"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Sunrise ${riseLabel}, sunset ${setLabel}, about ${sunHours.toFixed(1)} hours of sunshine`}
    >
      <rect x={0} y={top} width={W} height={bh} rx={6} fill="var(--night)" />
      <rect x={x(rise)} y={top} width={x(set) - x(rise)} height={bh} fill="var(--day)" />
      {sunHours > 0.05 && (
        <rect x={x(s0)} y={top + 3} width={Math.max(2, x(s1) - x(s0))} height={bh - 6} rx={4} fill="var(--sun)" />
      )}
      {nowX !== undefined && (
        <g>
          <line x1={nowX} x2={nowX} y1={top - 3} y2={top + bh + 3} stroke="var(--ink)" strokeWidth={2} strokeLinecap="round" />
          <circle cx={nowX} cy={top - 3} r={3} fill="var(--ink)" />
        </g>
      )}
      <text x={x(rise)} y={H - 2} textAnchor="middle">☀️↑ {riseLabel}</text>
      <text x={x(set)} y={H - 2} textAnchor="middle">☀️↓ {setLabel}</text>
    </svg>
  );
}
