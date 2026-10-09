import { cn } from "../lib/utils";

/** Faded single-tone "trusted by" logo strip: Slack · Zoom · Airbnb · Spotify · Envato. */
export function BrandLogos({ className }: { className?: string }) {
  const gray = "#c9c9d2";
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-10 gap-y-6",
        className
      )}
    >
      {/* Slack */}
      <span className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={gray} strokeWidth="3" strokeLinecap="round" aria-hidden>
          <path d="M10 3L8 21M16 3l-2 18M3.5 8.5h18M2.5 15.5h19" />
        </svg>
        <span className="text-lg font-semibold lowercase tracking-tight" style={{ color: gray }}>
          slack
        </span>
      </span>

      {/* Zoom */}
      <span className="text-xl font-extrabold lowercase tracking-tight" style={{ color: gray }}>
        zoom
      </span>

      {/* Airbnb */}
      <span className="text-lg font-bold tracking-tight" style={{ color: gray }}>
        airbnb
      </span>

      {/* Spotify */}
      <span className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke={gray} strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="10" strokeWidth="2.2" />
          <path d="M7.6 9.6c3-1.05 6.6-1 9.4.5" strokeWidth="2.1" />
          <path d="M8.6 12.9c2.5-.8 5-.65 7.4.4" strokeWidth="2.1" />
          <path d="M9.4 16c2-.55 4-.45 5.9.3" strokeWidth="2.1" />
        </svg>
        <span className="text-lg font-semibold tracking-tight" style={{ color: gray }}>
          Spotify
        </span>
      </span>

      {/* Envato */}
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill={gray} aria-hidden>
          <path d="M12 2.5c7 3.6 10 9.4 8.6 15.2-1.2 2.3-3.6 3.4-6.4 3.4 1.4-1.8 1.9-3.8 1.2-6.2-2.6 3.4-6.2 5.4-10.9 6 2.4-1.2 4-2.7 4.9-4.6-2.1.9-4.6 1-7.4.3C6.5 12.6 9.3 7 12 2.5z" />
        </svg>
        <span className="text-lg font-medium lowercase tracking-wide" style={{ color: gray }}>
          envato
        </span>
      </span>
    </div>
  );
}

export default BrandLogos;
