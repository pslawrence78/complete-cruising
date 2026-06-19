interface RouteMotifProps {
  className?: string;
}

export function RouteMotif({ className = "" }: RouteMotifProps) {
  return (
    <svg
      className={`route-motif ${className}`.trim()}
      viewBox="0 0 760 250"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="route-motif__wake"
        d="M20 196c80-22 116-104 204-98 89 7 103 91 190 81 84-10 95-106 179-117 58-7 97 23 147 62"
      />
      <path
        className="route-motif__route"
        d="M20 186c80-22 116-104 204-98 89 7 103 91 190 81 84-10 95-106 179-117 58-7 97 23 147 62"
      />
      {[20, 224, 414, 593, 740].map((x, index) => {
        const y = [186, 88, 169, 52, 114][index];
        return (
          <g key={x} transform={`translate(${x} ${y})`}>
            <circle r="9" className="route-motif__halo" />
            <circle r="3.5" className="route-motif__point" />
          </g>
        );
      })}
      <text x="24" y="226">41°54'N</text>
      <text x="636" y="24">VOYAGE 02</text>
    </svg>
  );
}
