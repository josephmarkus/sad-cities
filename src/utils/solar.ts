import type { City } from '../data/cities';

/**
 * Day-level climate and sun-position helpers.
 *
 * Days are addressed by a zero-based day-of-year (`doy`) within a single
 * calendar year. Sunrise/sunset are computed with the NOAA Solar Calculator
 * equations for the city's coordinates; sunshine and temperature are the
 * monthly climate normals smoothed to a daily curve.
 */

export const YEAR = new Date().getFullYear();
const LEAP = (YEAR % 4 === 0 && YEAR % 100 !== 0) || YEAR % 400 === 0;
export const DIM = [31, LEAP ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const NDAYS = LEAP ? 366 : 365;
export const MSTART = DIM.reduce<number[]>((acc, _d, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + DIM[i - 1]);
  return acc;
}, []);
/** Day-of-year at the middle of each month — where monthly normals are anchored. */
const MMID = DIM.map((d, i) => MSTART[i] + (d - 1) / 2);

export function doyToMonthDay(doy: number): [month: number, day: number] {
  let m = 0;
  while (m < 11 && doy >= MSTART[m + 1]) m++;
  return [m, doy - MSTART[m] + 1];
}

export function todayDoy(now = new Date()): number {
  return Math.round(
    (Date.UTC(YEAR, now.getMonth(), now.getDate()) - Date.UTC(YEAR, 0, 1)) / 864e5,
  );
}

/** `YYYY-MM-DD` for a native date input. */
export function doyToIso(doy: number): string {
  const [m, d] = doyToMonthDay(doy);
  return `${YEAR}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function isoToDoy(iso: string): number | null {
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const doy = Math.round((Date.UTC(YEAR, parts[1] - 1, parts[2]) - Date.UTC(YEAR, 0, 1)) / 864e5);
  return Math.max(0, Math.min(NDAYS - 1, doy));
}

// ─── Sun position (NOAA Solar Calculator) ────────────────────────────────────

const RAD = Math.PI / 180;

export interface SunTimes {
  /** Hours between sunrise and sunset */
  dayLength: number;
  /** UTC epoch ms */
  sunrise: number;
  sunset: number;
  solarNoon: number;
}

export function sunTimes(doy: number, lat: number, lon: number): SunTimes {
  const [m, d] = doyToMonthDay(doy);
  const jd = Date.UTC(YEAR, m, d, 12) / 864e5 + 2440587.5;
  const t = (jd - 2451545) / 36525;
  const L0 = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
  const M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  const C =
    Math.sin(M * RAD) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(2 * M * RAD) * (0.019993 - 0.000101 * t) +
    Math.sin(3 * M * RAD) * 0.000289;
  const omega = 125.04 - 1934.136 * t;
  const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(omega * RAD);
  const eps0 = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(omega * RAD);
  const decl = Math.asin(Math.sin(eps * RAD) * Math.sin(lambda * RAD));
  const y = Math.tan((eps * RAD) / 2) ** 2;
  const eqTime =
    (4 / RAD) *
    (y * Math.sin(2 * L0 * RAD) -
      2 * e * Math.sin(M * RAD) +
      4 * e * y * Math.sin(M * RAD) * Math.cos(2 * L0 * RAD) -
      0.5 * y * y * Math.sin(4 * L0 * RAD) -
      1.25 * e * e * Math.sin(2 * M * RAD));

  const cosHa =
    Math.cos(90.833 * RAD) / (Math.cos(lat * RAD) * Math.cos(decl)) -
    Math.tan(lat * RAD) * Math.tan(decl);
  const ha = cosHa >= 1 ? 0 : cosHa <= -1 ? 180 : Math.acos(cosHa) / RAD;

  const noonMin = 720 - 4 * lon - eqTime; // minutes after 00:00 UTC
  const base = Date.UTC(YEAR, m, d);
  return {
    dayLength: (8 * ha) / 60,
    sunrise: base + (noonMin - 4 * ha) * 6e4,
    sunset: base + (noonMin + 4 * ha) * 6e4,
    solarNoon: base + noonMin * 6e4,
  };
}

// ─── Local time formatting ───────────────────────────────────────────────────

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    const opts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' };
    try {
      f = new Intl.DateTimeFormat('en-GB', { ...opts, timeZone });
    } catch {
      // Older ICU builds only know Kyiv by its legacy name.
      f = new Intl.DateTimeFormat('en-GB', { ...opts, timeZone: timeZone === 'Europe/Kyiv' ? 'Europe/Kiev' : 'UTC' });
    }
    formatters.set(timeZone, f);
  }
  return f;
}

/** `HH:MM` in the given time zone. */
export function localTime(ms: number, timeZone: string): string {
  return formatterFor(timeZone).format(new Date(ms));
}

/** Decimal hours since local midnight in the given time zone. */
export function localHours(ms: number, timeZone: string): number {
  const [h, m] = localTime(ms, timeZone).split(':').map(Number);
  return h + m / 60;
}

// ─── Daily climate curves ────────────────────────────────────────────────────

/** Cyclic Catmull-Rom interpolation through 12 mid-month values. */
function interpolateMonthly(values: readonly number[], doy: number): number {
  let i = 11;
  for (let k = 0; k < 12; k++) if (doy >= MMID[k]) i = k;
  const x0 = MMID[i];
  const x1 = i === 11 ? MMID[0] + NDAYS : MMID[i + 1];
  const x = doy < MMID[0] ? doy + NDAYS : doy;
  const t = (x - x0) / (x1 - x0);
  const p0 = values[(i + 11) % 12];
  const p1 = values[i];
  const p2 = values[(i + 1) % 12];
  const p3 = values[(i + 2) % 12];
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

export interface CityYear {
  sunlight: number[];
  daylight: number[];
  temperature: number[];
  /** Monthly total for the month each day falls in */
  rainfall: number[];
}

const yearCache = new Map<string, CityYear>();

/** One value per day of the year for each metric. Memoised per city. */
export function cityYear(city: City): CityYear {
  const cached = yearCache.get(city.id);
  if (cached) return cached;
  const out: CityYear = { sunlight: [], daylight: [], temperature: [], rainfall: [] };
  for (let d = 0; d < NDAYS; d++) {
    const dayLength = sunTimes(d, city.lat, city.lon).dayLength;
    out.daylight.push(dayLength);
    // Smoothing can overshoot slightly; sunshine can't be negative or fill the whole day.
    out.sunlight.push(Math.max(0, Math.min(dayLength * 0.92, interpolateMonthly(city.sunlight, d))));
    out.temperature.push(interpolateMonthly(city.temperature, d));
    out.rainfall.push(city.rainfall[doyToMonthDay(d)[0]]);
  }
  yearCache.set(city.id, out);
  return out;
}

// ─── Formatting ──────────────────────────────────────────────────────────────

/** `9h 05m` */
export function formatDuration(hours: number): string {
  const total = Math.round(hours * 60);
  return `${Math.floor(total / 60)}h ${String(total % 60).padStart(2, '0')}m`;
}

/** `+1h 05m`, `−12 min`, or `same` */
export function formatDurationDelta(hours: number): string {
  const total = Math.round(Math.abs(hours) * 60);
  if (total === 0) return 'same';
  const sign = hours > 0 ? '+' : '−';
  return total < 60
    ? `${sign}${total} min`
    : `${sign}${Math.floor(total / 60)}h ${String(total % 60).padStart(2, '0')}m`;
}

/** `+0.8h`, `−3°`, or `same` */
export function formatDelta(value: number, unit: string, decimals = 1): string {
  const rounded = Number(value.toFixed(decimals));
  if (rounded === 0) return 'same';
  return `${rounded > 0 ? '+' : '−'}${Math.abs(rounded).toFixed(decimals)}${unit}`;
}
