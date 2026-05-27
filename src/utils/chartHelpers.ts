import type { City } from '../data/cities';
import { MONTHS } from '../data/cities';

export type Metric = 'daylight' | 'rainfall' | 'temperature';
export type ViewMode = 'absolute' | 'deviation';

// Days per month for a non-leap reference year (used to convert hrs/day → hrs/year)
export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

/** Total hours of daylight in the year (sum of hrs/day × days in each month). */
export function yearlyDaylight(city: City): number {
  return city.daylight.reduce((sum, h, i) => sum + h * DAYS_IN_MONTH[i], 0);
}

/** Total rainfall in mm for the year. */
export function yearlyRainfall(city: City): number {
  return city.rainfall.reduce((sum, mm) => sum + mm, 0);
}

/** Mean annual temperature in °C. */
export function yearlyMeanTemperature(city: City): number {
  return city.temperature.reduce((sum, t) => sum + t, 0) / 12;
}

/**
 * Returns a short formatted yearly summary for the given metric,
 * suitable for display in chart labels or table cells.
 */
export function formatYearlyTotal(city: City, metric: Metric): string {
  if (metric === 'daylight') {
    return `${new Intl.NumberFormat('en-US').format(Math.round(yearlyDaylight(city)))} hrs/yr`;
  }
  if (metric === 'rainfall') {
    return `${Math.round(yearlyRainfall(city))} mm/yr`;
  }
  const mean = yearlyMeanTemperature(city);
  return `${mean >= 0 ? '' : ''}${mean.toFixed(1)}°C avg`;
}

export interface ChartDataPoint {
  month: string;
  [cityName: string]: number | string;
}

/**
 * Transforms selected city data into the format Recharts expects:
 * an array of 12 objects, one per month, with city names as keys.
 *
 * In 'deviation' mode each city's values are re-expressed as the
 * difference from that city's own yearly mean — useful for comparing
 * seasonal amplitude across cities whose absolute curves cluster
 * (e.g. daylight at similar latitudes).
 */
export function transformForRecharts(
  cities: City[],
  metric: Metric,
  viewMode: ViewMode = 'absolute'
): ChartDataPoint[] {
  const cityMeans = new Map<string, number>();
  if (viewMode === 'deviation') {
    for (const city of cities) {
      const values = city[metric];
      const sum = values.reduce((s, v) => s + v, 0);
      cityMeans.set(city.id, sum / values.length);
    }
  }

  return MONTHS.map((month, i) => {
    const point: ChartDataPoint = { month };
    for (const city of cities) {
      const v = city[metric][i];
      point[city.name] = viewMode === 'deviation' ? v - cityMeans.get(city.id)! : v;
    }
    return point;
  });
}

export const METRIC_LABELS: Record<Metric, string> = {
  daylight: 'Daylight (hrs / day)',
  rainfall: 'Rainfall (mm)',
  temperature: 'Temperature (°C)',
};

export const METRIC_DEVIATION_LABELS: Record<Metric, string> = {
  daylight: 'Daylight Δ from yearly mean (hrs)',
  rainfall: 'Rainfall Δ from yearly mean (mm)',
  temperature: 'Temperature Δ from yearly mean (°C)',
};

export const METRIC_UNITS: Record<Metric, string> = {
  daylight: 'h',
  rainfall: 'mm',
  temperature: '°C',
};

export function getYAxisLabel(metric: Metric, viewMode: ViewMode): string {
  return viewMode === 'deviation'
    ? METRIC_DEVIATION_LABELS[metric]
    : METRIC_LABELS[metric];
}
