import { CITIES } from '../data/cities';

const PARAM = 'cities';
const VALID_IDS = new Set(CITIES.map((c) => c.id));

/** Reads `?cities=a,b,c` from the URL, keeping only known, unique ids in order. */
export function readCitiesFromUrl(): string[] | null {
  const raw = new URLSearchParams(window.location.search).get(PARAM);
  if (raw === null) return null;
  const ids = [...new Set(raw.split(',').map((s) => s.trim().toLowerCase()))].filter((id) =>
    VALID_IDS.has(id),
  );
  return ids.length > 0 ? ids : null;
}

/** Writes the selection to `?cities=` without adding a history entry. */
export function writeCitiesToUrl(ids: string[]): void {
  const url = new URL(window.location.href);
  if (ids.length > 0) {
    url.searchParams.set(PARAM, ids.join(','));
  } else {
    url.searchParams.delete(PARAM);
  }
  // URLSearchParams encodes commas as %2C; keep them readable in shared links.
  // Ids are already restricted to known city ids, so only [a-z0-9-] reach here.
  const search = url.searchParams.toString().replace(/%2C/gi, ',');
  url.search = search ? `?${search}` : '';
  // Pass an absolute same-origin URL: a relative path such as "//host/..."
  // (from a pathname with a leading double slash) would resolve cross-origin.
  if (url.href !== window.location.href) {
    window.history.replaceState(window.history.state, '', url.href);
  }
}
