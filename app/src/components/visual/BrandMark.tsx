interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <span className={`brand-mark ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 64 64" focusable="false">
        <circle cx="32" cy="32" r="25.5" className="brand-mark__ring" />
        <path d="M32 7.5 36.5 27 56.5 32 36.5 37 32 56.5 27.5 37 7.5 32 27.5 27Z" />
        <circle cx="32" cy="32" r="12.5" className="brand-mark__centre" />
      </svg>
      <span>CC</span>
    </span>
  );
}
