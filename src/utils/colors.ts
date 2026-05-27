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

/** Returns a consistent colour for a given city id, cycling through the palette. */
export function getColor(cityId: string, allCityIds: string[]): string {
  const index = allCityIds.indexOf(cityId);
  return PALETTE[index % PALETTE.length];
}
