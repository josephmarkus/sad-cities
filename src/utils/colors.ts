import { CITIES } from '../data/cities';

const CITY_ORDER = new Map(CITIES.map((c, i) => [c.id, i]));

/**
 * Line colours are CSS variables (--city-1 … --city-16, defined in index.css)
 * so each slot can have its own light- and dark-theme value.
 */
const PALETTE_SIZE = 16;

/**
 * Returns the colour for a selected city.
 *
 * Colours are assigned by the city's position among the *selected* cities
 * (in the canonical CITIES order), so every selected city gets a distinct
 * colour regardless of the order the cities were picked in. Indexing into
 * all cities instead would make cities 16 apart collide — e.g. London
 * and Toronto were both blue.
 */
export function getColor(cityId: string, selectedIds: readonly string[]): string {
  const ordered = [...selectedIds].sort((a, b) => (CITY_ORDER.get(a) ?? 0) - (CITY_ORDER.get(b) ?? 0));
  const index = Math.max(0, ordered.indexOf(cityId));
  return `var(--city-${(index % PALETTE_SIZE) + 1})`;
}
