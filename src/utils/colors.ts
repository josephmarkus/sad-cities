import { CITIES } from '../data/cities';

const CITY_ORDER = new Map(CITIES.map((c, i) => [c.id, i]));

/**
 * Fixed colour palette for city lines.
 * Colours are chosen to be visually distinct and work on a white background.
 */

const PALETTE = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#d97706', // amber
  '#7c3aed', // violet
  '#0891b2', // cyan
  '#db2777', // pink
  '#65a30d', // lime
  '#ea580c', // orange
  '#0284c7', // sky
  '#9333ea', // purple
  '#059669', // emerald
  '#b45309', // yellow-brown
  '#e11d48', // rose
  '#0d9488', // teal
  '#6d28d9', // indigo
];

/**
 * Returns the colour for a selected city.
 *
 * Colours are assigned by the city's position among the *selected* cities
 * (in the canonical CITIES order), so every selected city gets a distinct
 * colour regardless of the order the cities were picked in. Indexing into
 * all 42 cities instead would make cities 16 apart collide — e.g. London
 * and Toronto were both blue.
 */
export function getColor(cityId: string, selectedIds: readonly string[]): string {
  const ordered = [...selectedIds].sort((a, b) => (CITY_ORDER.get(a) ?? 0) - (CITY_ORDER.get(b) ?? 0));
  const index = Math.max(0, ordered.indexOf(cityId));
  return PALETTE[index % PALETTE.length];
}
