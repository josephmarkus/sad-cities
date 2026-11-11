import { useLayoutEffect, useRef, useState } from 'react';
import type { City } from '../data/cities';
import { MONTHS } from '../data/cities';
import type { Metric } from '../utils/chartHelpers';
import { METRIC_UNITS } from '../utils/chartHelpers';
import { getColor } from '../utils/colors';
import { cityYear, DIM, doyToMonthDay, formatDuration, MSTART, NDAYS } from '../utils/solar';

const MARGIN = { l: 34, r: 8, t: 10, b: 24 };
const MONTH_MID = DIM.map((d, i) => MSTART[i] + (d - 1) / 2);

interface YearViewProps {
  /** Selected cities, base city first */
  cities: City[];
  baseId: string;
  metric: Metric;
  doy: number;
  today: number;
  onDoyChange: (doy: number) => void;
}

function niceTicks(min: number, max: number, count: number): number[] {
  const span = max - min || 1;
  const mag = 10 ** Math.floor(Math.log10(span / count));
  const step = [1, 2, 2.5, 5, 10].map((s) => s * mag).find((s) => span / s <= count) ?? 10 * mag;
  const ticks: number[] = [];
  for (let v = Math.floor(min / step) * step; v <= Math.ceil(max / step) * step + 1e-9; v += step) {
    ticks.push(Number(v.toFixed(6)));
  }
  return ticks;
}

function formatMetricValue(metric: Metric, value: number): string {
  if (metric === 'daylight') return formatDuration(value);
  if (metric === 'sunlight') return `${value.toFixed(1)} h`;
  return `${Math.round(value)} ${METRIC_UNITS[metric]}`;
}

/**
 * One line per city across every day of the year, with the selected day
 * marked. Click or drag across the plot to move the selected day.
 */
export default function YearView({ cities, baseId, metric, doy, today, onDoyChange }: YearViewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const [width, setWidth] = useState(600);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(Math.max(280, el.clientWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (cities.length === 0) return null;

  const selectedIds = cities.map((c) => c.id);

  const W = width;
  const H = Math.round(Math.min(260, Math.max(190, W * 0.5)));
  const plotW = W - MARGIN.l - MARGIN.r;
  const series = cities.map((c) => ({ city: c, values: cityYear(c)[metric] }));

  let lo = Infinity;
  let hi = -Infinity;
  for (const s of series) for (const v of s.values) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
  if (metric !== 'temperature') lo = 0;
  const ticks = niceTicks(lo, hi, 4);
  lo = ticks[0];
  hi = ticks[ticks.length - 1];

  const x = (d: number) => MARGIN.l + (d / (NDAYS - 1)) * plotW;
  const y = (v: number) => MARGIN.t + (1 - (v - lo) / (hi - lo)) * (H - MARGIN.t - MARGIN.b);
  const wide = W > 420;

  const pathFor = (values: number[]) => {
    if (metric === 'rainfall') {
      // Rainfall is a monthly total, so draw it as steps.
      return MSTART.map((s, i) => {
        const yy = y(values[s]).toFixed(1);
        return `${i ? 'L' : 'M'}${x(s).toFixed(1)},${yy} L${x(Math.min(NDAYS - 1, s + DIM[i])).toFixed(1)},${yy}`;
      }).join(' ');
    }
    let d = '';
    for (let i = 0; i < NDAYS; i += 2) d += `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(values[i]).toFixed(1)}`;
    return d + `L${x(NDAYS - 1).toFixed(1)},${y(values[NDAYS - 1]).toFixed(1)}`;
  };

  const pick = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = (clientX - r.left) * (W / r.width);
    const d = Math.round(((px - MARGIN.l) / plotW) * (NDAYS - 1));
    onDoyChange(Math.max(0, Math.min(NDAYS - 1, d)));
  };

  const [month, day] = doyToMonthDay(doy);

  return (
    <div className="year-view" ref={wrapRef}>
      <div className="year-readout">
        <span className="year-readout-when">{day} {MONTHS[month]}</span>
        {series.map(({ city, values }) => (
          <span key={city.id}>
            <i className="dot" style={{ background: getColor(city.id, selectedIds) }} />
            {city.name} <b>{formatMetricValue(metric, values[doy])}</b>
          </span>
        ))}
        {metric === 'rainfall' && <span>in {MONTHS[month]}</span>}
      </div>
      <svg
        ref={svgRef}
        className="year-chart"
        viewBox={`0 0 ${W} ${H}`}
        height={H}
        role="img"
        aria-label="Daily values through the year for each selected city"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          pick(e.clientX);
        }}
        onPointerMove={(e) => { if (dragging.current) pick(e.clientX); }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
      >
        {MSTART.map((s, i) =>
          i % 2 === 1 ? (
            <rect key={i} x={x(s)} y={MARGIN.t} width={x(s + DIM[i]) - x(s)} height={H - MARGIN.t - MARGIN.b} fill="var(--band)" />
          ) : null,
        )}
        {ticks.map((t, i) => (
          <g key={t}>
            <line x1={MARGIN.l} x2={W - MARGIN.r} y1={y(t)} y2={y(t)} stroke="var(--grid)" />
            <text x={MARGIN.l - 6} y={y(t) + 4} textAnchor="end">
              {t}{i === ticks.length - 1 && metric !== 'rainfall' ? METRIC_UNITS[metric] : ''}
            </text>
          </g>
        ))}
        {metric === 'temperature' && lo < 0 && hi > 0 && (
          <line x1={MARGIN.l} x2={W - MARGIN.r} y1={y(0)} y2={y(0)} stroke="var(--muted)" />
        )}
        {MONTH_MID.map((mid, i) =>
          wide || i % 2 === 0 ? (
            <text key={i} x={x(mid)} y={H - 6} textAnchor="middle">{wide ? MONTHS[i] : MONTHS[i][0]}</text>
          ) : null,
        )}
        <line x1={x(today)} x2={x(today)} y1={MARGIN.t} y2={H - MARGIN.b} stroke="var(--muted)" strokeDasharray="2 3" />
        {[...series].reverse().map(({ city, values }) => (
          <path
            key={city.id}
            d={pathFor(values)}
            fill="none"
            stroke={getColor(city.id, selectedIds)}
            strokeWidth={city.id === baseId ? 2.5 : 2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        <line x1={x(doy)} x2={x(doy)} y1={MARGIN.t} y2={H - MARGIN.b} stroke="var(--ink)" strokeWidth={1.5} />
        {series.map(({ city, values }) => (
          <circle key={city.id} cx={x(doy)} cy={y(values[doy])} r={5} fill={getColor(city.id, selectedIds)} stroke="var(--surface)" strokeWidth={2} />
        ))}
      </svg>
    </div>
  );
}
