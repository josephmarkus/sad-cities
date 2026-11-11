import { useRef, useState } from 'react';
import { CITIES, REGION_LABELS, REGION_ORDER } from '../data/cities';
import { getColor } from '../utils/colors';
import { cityYear, doyToMonthDay } from '../utils/solar';
import { MONTHS } from '../data/cities';

interface CityChipsProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  baseId: string;
  onBaseChange: (id: string) => void;
  /** Selected day — the picker shows each city's typical sunshine on it */
  doy: number;
}

/**
 * The selected cities as chips (tap a name to compare everyone against it,
 * × to remove), plus an "Add city" sheet with search.
 */
export default function CityChips({ selectedIds, onChange, baseId, onBaseChange, doy }: CityChipsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');

  // Base city first, then the rest in the order they were picked.
  const ordered = [
    ...selectedIds.filter((id) => id === baseId),
    ...selectedIds.filter((id) => id !== baseId),
  ];
  const byId = new Map(CITIES.map((c) => [c.id, c]));

  const open = () => {
    setQuery('');
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  const q = query.trim().toLowerCase();
  const [month, day] = doyToMonthDay(doy);
  const dateLabel = `${day} ${MONTHS[month]}`;

  const groups = REGION_ORDER.map((region) => ({
    region,
    label: REGION_LABELS[region],
    cities: CITIES.filter(
      (c) => c.region === region && (!q || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)),
    ),
  })).filter((g) => g.cities.length > 0);

  return (
    <>
      <div className="chips">
        {ordered.map((id) => {
          const city = byId.get(id);
          if (!city) return null;
          const isBase = id === baseId;
          return (
            <span key={id} className={`chip${isBase ? ' chip--base' : ''}`}>
              <button
                className="chip-name"
                onClick={() => onBaseChange(id)}
                aria-pressed={isBase}
                aria-label={`Compare everyone against ${city.name}`}
              >
                <span className="dot" style={{ background: getColor(id, selectedIds) }} />
                {city.name}
              </button>
              {selectedIds.length > 1 && (
                <button
                  className="chip-remove"
                  onClick={() => onChange(selectedIds.filter((s) => s !== id))}
                  aria-label={`Remove ${city.name}`}
                >
                  ×
                </button>
              )}
            </span>
          );
        })}
        <button className="chip-add" onClick={open}>+ Add city</button>
      </div>

      <dialog
        ref={dialogRef}
        className="sheet"
        aria-labelledby="sheet-title"
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <div className="sheet-inner">
          <div className="sheet-top">
            <div className="sheet-row">
              <h2 id="sheet-title" className="section-title">Add a city</h2>
              <button className="pill-btn" onClick={close}>Done</button>
            </div>
            <input
              type="search"
              className="sheet-search"
              placeholder={`Search ${CITIES.length} cities`}
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="sheet-list">
            {groups.length === 0 && <p className="sheet-empty">No city matches “{query}”.</p>}
            {groups.map((g) => (
              <div key={g.region}>
                <h3 className="sheet-region">{g.label}</h3>
                {g.cities.map((c) => {
                  const added = selectedIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      className="sheet-option"
                      disabled={added}
                      onClick={() => onChange([...selectedIds, c.id])}
                    >
                      <span>
                        {c.name} <span className="sheet-meta">{c.country}</span>
                      </span>
                      <span className="sheet-meta">
                        {added ? 'added' : `${cityYear(c).sunlight[doy].toFixed(1)}h sun on ${dateLabel}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
