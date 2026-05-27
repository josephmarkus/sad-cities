import type { City } from '../data/cities';
import { CITIES, REGION_LABELS, REGION_ORDER, CITIES as ALL_CITIES } from '../data/cities';
import { getColor } from '../utils/colors';

interface CitySelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const ALL_CITY_IDS = ALL_CITIES.map((c) => c.id);

function toggle(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
}

export default function CitySelector({ selectedIds, onChange }: CitySelectorProps) {
  const grouped = REGION_ORDER.map((region) => ({
    region,
    label: REGION_LABELS[region],
    cities: CITIES.filter((c) => c.region === region),
  }));

  return (
    <div className="city-selector">
      {grouped.map(({ region, label, cities }) => (
        <div key={region} className="region-group">
          <span className="region-label">{label}</span>
          <div className="chip-row">
            {cities.map((city: City) => {
              const active = selectedIds.includes(city.id);
              const color = getColor(city.id, ALL_CITY_IDS);
              return (
                <button
                  key={city.id}
                  className={`chip${active ? ' chip--active' : ''}`}
                  style={active ? { borderColor: color, color: color } : undefined}
                  onClick={() => onChange(toggle(selectedIds, city.id))}
                  aria-pressed={active}
                >
                  {city.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
