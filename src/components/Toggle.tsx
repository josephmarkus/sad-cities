interface ToggleOption<T extends string> {
  label: string;
  value: T;
}

interface ToggleProps<T extends string> {
  value: T;
  options: ToggleOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
}

export default function Toggle<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: ToggleProps<T>) {
  return (
    <div className="metric-toggle" role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`toggle-btn${value === opt.value ? ' toggle-btn--active' : ''}`}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
