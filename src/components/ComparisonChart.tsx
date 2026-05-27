import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  usePlotArea,
  useYAxisScale,
} from 'recharts';
import type { City } from '../data/cities';
import { CITIES } from '../data/cities';
import type { Metric, ViewMode } from '../utils/chartHelpers';
import { transformForRecharts, getYAxisLabel, METRIC_UNITS } from '../utils/chartHelpers';
import { getColor } from '../utils/colors';

interface ComparisonChartProps {
  selectedCities: City[];
  metric: Metric;
  viewMode: ViewMode;
}

const ALL_CITY_IDS = CITIES.map((c) => c.id);
const RIGHT_LABEL_GUTTER = 96;
const LABEL_FONT_SIZE = 12;
const LABEL_MIN_SPACING = 14;

interface LabelItem {
  name: string;
  value: number;
  color: string;
}

/**
 * Renders the city name at the right end of each line. Runs a forward/backward
 * pass to push overlapping labels apart so nearly-identical lines remain readable.
 */
function CityEndLabels({ items }: { items: LabelItem[] }) {
  const plotArea = usePlotArea();
  const yScale = useYAxisScale();

  if (!plotArea || !yScale || items.length === 0) return null;

  const positioned = items
    .map((it) => {
      const y = yScale(it.value);
      return typeof y === 'number' && Number.isFinite(y)
        ? { ...it, y }
        : null;
    })
    .filter((x): x is LabelItem & { y: number } => x !== null)
    .sort((a, b) => a.y - b.y);

  // Forward pass: push down anything too close to its predecessor.
  for (let i = 1; i < positioned.length; i++) {
    const gap = positioned[i].y - positioned[i - 1].y;
    if (gap < LABEL_MIN_SPACING) {
      positioned[i].y = positioned[i - 1].y + LABEL_MIN_SPACING;
    }
  }
  // Backward pass: if we ran past the bottom edge, pull everything back up.
  const bottom = plotArea.y + plotArea.height;
  const top = plotArea.y;
  for (let i = positioned.length - 1; i > 0; i--) {
    if (positioned[i].y > bottom) positioned[i].y = bottom;
    const gap = positioned[i].y - positioned[i - 1].y;
    if (gap < LABEL_MIN_SPACING) {
      positioned[i - 1].y = positioned[i].y - LABEL_MIN_SPACING;
    }
  }
  // Clamp top.
  for (const p of positioned) {
    if (p.y < top) p.y = top;
  }

  const x = plotArea.x + plotArea.width + 6;

  return (
    <g pointerEvents="none">
      {positioned.map((p) => (
        <text
          key={p.name}
          x={x}
          y={p.y}
          fill={p.color}
          fontSize={LABEL_FONT_SIZE}
          dominantBaseline="middle"
          style={{ fontWeight: 500 }}
        >
          {p.name}
        </text>
      ))}
    </g>
  );
}

export default function ComparisonChart({
  selectedCities,
  metric,
  viewMode,
}: ComparisonChartProps) {
  const data = useMemo(
    () => transformForRecharts(selectedCities, metric, viewMode),
    [selectedCities, metric, viewMode]
  );

  const yDomain = useMemo<[number, number]>(() => {
    const values: number[] = [];
    for (const point of data) {
      for (const city of selectedCities) {
        const v = point[city.name];
        if (typeof v === 'number') values.push(v);
      }
    }
    if (values.length === 0) return [0, 1];
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (viewMode === 'deviation') {
      const m = Math.max(Math.abs(min), Math.abs(max), 1);
      const padded = Math.ceil(m * 1.1);
      return [-padded, padded];
    }
    const range = max - min || 1;
    const pad = Math.max(range * 0.08, 0.5);
    return [Math.floor(min - pad), Math.ceil(max + pad)];
  }, [data, selectedCities, viewMode]);

  const yTicks = useMemo<number[]>(() => {
    const [min, max] = yDomain;
    const range = max - min;
    if (range <= 0) return [min, max];
    // Aim for ~9 gridlines; snap step to 1/2/5 × 10^k so labels stay clean.
    const rough = range / 9;
    const pow = Math.pow(10, Math.floor(Math.log10(rough)));
    const norm = rough / pow;
    const niceMul = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
    const step = niceMul * pow;
    const ticks: number[] = [];
    const start = Math.ceil(min / step) * step;
    for (let t = start; t <= max + step * 1e-6; t += step) {
      // Round-trip through step to avoid floating-point drift accumulating.
      ticks.push(Math.round(t / step) * step);
    }
    return ticks;
  }, [yDomain]);

  const labelItems = useMemo<LabelItem[]>(() => {
    const lastPoint = data[data.length - 1];
    if (!lastPoint) return [];
    return selectedCities.map((city) => ({
      name: city.name,
      value: lastPoint[city.name] as number,
      color: getColor(city.id, ALL_CITY_IDS),
    }));
  }, [data, selectedCities]);

  if (selectedCities.length === 0) {
    return (
      <div className="chart-empty">
        Select at least one city to display data.
      </div>
    );
  }

  const unit = METRIC_UNITS[metric];
  // Daylight gets one decimal (values cluster within a narrow band); the others
  // round to integers since their natural unit step is already coarse.
  const formatNumber = (v: number): string => {
    if (metric === 'daylight') {
      const fixed = v.toFixed(1);
      return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
    }
    return Math.round(v).toString();
  };
  const formatTick = (v: number) => {
    if (!Number.isFinite(v)) return '';
    const sign = viewMode === 'deviation' && v > 0 ? '+' : '';
    return `${sign}${formatNumber(v)}${unit ? ` ${unit}` : ''}`;
  };
  const formatTooltip = (v: unknown) => {
    if (typeof v !== 'number' || !Number.isFinite(v)) return String(v ?? '');
    const sign = viewMode === 'deviation' && v > 0 ? '+' : '';
    return `${sign}${formatNumber(v)}${unit ? ` ${unit}` : ''}`;
  };

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 12, right: RIGHT_LABEL_GUTTER, bottom: 0, left: 8 }}
        >
          <CartesianGrid stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#888' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={yDomain}
            ticks={yTicks}
            tick={{ fontSize: 12, fill: '#888' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatTick}
            label={{
              value: getYAxisLabel(metric, viewMode),
              angle: -90,
              position: 'insideLeft',
              offset: 8,
              style: { fontSize: 11, fill: '#aaa', textAnchor: 'middle' },
            }}
            width={64}
          />
          {viewMode === 'deviation' && (
            <ReferenceLine y={0} stroke="#d0d0d0" strokeDasharray="3 3" />
          )}
          <Tooltip
            contentStyle={{
              border: '1px solid #e5e5e5',
              borderRadius: 6,
              fontSize: 12,
              boxShadow: 'none',
            }}
            itemStyle={{ padding: '1px 0' }}
            formatter={formatTooltip}
          />
          {selectedCities.map((city) => (
            <Line
              key={city.id}
              type="monotone"
              dataKey={city.name}
              stroke={getColor(city.id, ALL_CITY_IDS)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          ))}
          <CityEndLabels items={labelItems} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
