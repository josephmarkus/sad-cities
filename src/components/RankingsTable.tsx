import { useMemo } from 'react';
import { CITIES } from '../data/cities';
import type { Metric } from '../utils/chartHelpers';
import {
  yearlyDaylight,
  yearlyRainfall,
  yearlyMeanTemperature,
} from '../utils/chartHelpers';
import { getColor } from '../utils/colors';

const ALL_CITY_IDS = CITIES.map((c) => c.id);

interface RankingsTableProps {
  metric: Metric;
  selectedIds: string[];
}

interface Row {
  id: string;
  name: string;
  country: string;
  daylight: number;   // total hours/year
  rainfall: number;  // total mm/year
  temperature: number; // mean °C
}

export default function RankingsTable({ metric, selectedIds }: RankingsTableProps) {
  const rows = useMemo<Row[]>(() => {
    const all: Row[] = CITIES.map((city) => ({
      id: city.id,
      name: city.name,
      country: city.country,
      daylight: yearlyDaylight(city),
      rainfall: yearlyRainfall(city),
      temperature: yearlyMeanTemperature(city),
    }));

    // Sort: more daylight = better (desc); less rain = better (asc); warmer = better (desc)
    if (metric === 'daylight') all.sort((a, b) => b.daylight - a.daylight);
    else if (metric === 'rainfall') all.sort((a, b) => a.rainfall - b.rainfall);
    else all.sort((a, b) => b.temperature - a.temperature);

    return all;
  }, [metric]);

  return (
    <div className="rankings-wrapper">
      <table className="rankings-table">
        <thead>
          <tr>
            <th className="rankings-col-rank">#</th>
            <th className="rankings-col-city">City</th>
            <th className={`rankings-col-num${metric === 'daylight' ? ' rankings-col-active' : ''}`}>
              Daylight
              <span className="rankings-unit"> hrs/yr</span>
            </th>
            <th className={`rankings-col-num${metric === 'rainfall' ? ' rankings-col-active' : ''}`}>
              Rainfall
              <span className="rankings-unit"> mm/yr</span>
            </th>
            <th className={`rankings-col-num${metric === 'temperature' ? ' rankings-col-active' : ''}`}>
              Temp
              <span className="rankings-unit"> °C avg</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isSelected = selectedIds.includes(row.id);
            const color = isSelected ? getColor(row.id, ALL_CITY_IDS) : undefined;
            return (
              <tr key={row.id} className={isSelected ? 'rankings-row-selected' : ''}>
                <td className="rankings-col-rank">{i + 1}</td>
                <td className="rankings-col-city">
                  <span style={color ? { color, fontWeight: 600 } : undefined}>
                    {row.name}
                  </span>
                  <span className="rankings-country">, {row.country}</span>
                </td>
                <td className={`rankings-col-num${metric === 'daylight' ? ' rankings-col-active' : ''}`}>
                  {new Intl.NumberFormat('en-US').format(Math.round(row.daylight))}
                </td>
                <td className={`rankings-col-num${metric === 'rainfall' ? ' rankings-col-active' : ''}`}>
                  {Math.round(row.rainfall)}
                </td>
                <td className={`rankings-col-num${metric === 'temperature' ? ' rankings-col-active' : ''}`}>
                  {row.temperature.toFixed(1)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
