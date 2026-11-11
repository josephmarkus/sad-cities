import type { City } from '../data/cities';
import { MONTHS } from '../data/cities';
import type { Metric } from '../utils/chartHelpers';
import { getColor } from '../utils/colors';
import { doyToMonthDay, formatDuration, MSTART } from '../utils/solar';

interface MonthTableProps {
  /** Selected cities, base city first */
  cities: City[];
  metric: Metric;
  doy: number;
  onDoyChange: (doy: number) => void;
}

function formatCell(metric: Metric, v: number): string {
  if (metric === 'daylight') return formatDuration(v);
  if (metric === 'sunlight') return v.toFixed(1);
  if (metric === 'temperature') return `${Math.round(v)}°`;
  return String(Math.round(v));
}

/** Twelve rows of monthly normals; clicking a row jumps to the 15th of that month. */
export default function MonthTable({ cities, metric, doy, onDoyChange }: MonthTableProps) {
  if (cities.length === 0) return null;

  const selectedIds = cities.map((c) => c.id);
  const [currentMonth] = doyToMonthDay(doy);
  const max = Math.max(...cities.flatMap((c) => c[metric]));
  const jump = (i: number) => onDoyChange(MSTART[i] + 14);

  return (
    <div className="month-table-wrap">
      <table className="month-table">
        <thead>
          <tr>
            <th scope="col"><span className="visually-hidden">Month</span></th>
            {cities.map((c) => (
              <th key={c.id} scope="col">
                <i className="dot" style={{ background: getColor(c.id, selectedIds) }} />
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MONTHS.map((name, i) => {
            const values = cities.map((c) => c[metric][i]);
            // Highlight the "best" city in each month — not meaningful for temperature.
            const best =
              metric === 'temperature' || cities.length < 2
                ? -1
                : metric === 'rainfall'
                  ? values.indexOf(Math.min(...values))
                  : values.indexOf(Math.max(...values));
            return (
              <tr
                key={name}
                className={i === currentMonth ? 'month-row--current' : undefined}
                tabIndex={0}
                aria-label={`Jump to 15 ${name}`}
                onClick={() => jump(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    jump(i);
                  }
                }}
              >
                <th scope="row">{name}</th>
                {cities.map((c, j) => (
                  <td key={c.id}>
                    <div className="month-cell">
                      <span className="month-cell-value">
                        {formatCell(metric, values[j])}
                        {j === best && <span className="month-cell-best"> {metric === 'rainfall' ? 'driest' : 'most'}</span>}
                      </span>
                      {metric !== 'temperature' && (
                        <span className="month-cell-bar">
                          <i style={{ width: `${(values[j] / max) * 100}%`, background: getColor(c.id, selectedIds) }} />
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
