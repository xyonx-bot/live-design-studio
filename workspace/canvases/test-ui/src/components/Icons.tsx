import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function Sparkle(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 3c.7 4.6 2.7 6.6 7.4 7.3-4.7.7-6.7 2.7-7.4 7.4-.7-4.7-2.7-6.7-7.4-7.4C9.3 9.6 11.3 7.6 12 3z" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  );
}

export function CloseX(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** Solid circular play badge — black circle, white triangle. */
export function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-neutral-900 ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-[45%] w-[45%] fill-white">
        <path d="M8.5 5.5l11 6.5-11 6.5z" />
      </svg>
    </span>
  );
}

/** macOS-style cursor pointer used on the chart tooltip. */
export function CursorArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M5 2.5l14.5 8.2-6.6 1.6 3.8 6.6-2.9 1.7-3.9-6.7-4.9 3.9z"
        fill="#17181c"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function USFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={`rounded-[2px] ${className}`} aria-hidden>
      <rect width="20" height="14" fill="#fff" />
      {[0, 4, 8, 12].map((y) => (
        <rect key={y} y={y} width="20" height="1.6" fill="#d92b3a" />
      ))}
      <rect width="9" height="7" fill="#2c4b8d" />
      <g fill="#fff">
        <circle cx="1.6" cy="1.6" r="0.45" />
        <circle cx="4.4" cy="3.6" r="0.45" />
        <circle cx="7.2" cy="1.6" r="0.45" />
        <circle cx="3" cy="5.4" r="0.45" />
        <circle cx="6" cy="1.6" r="0.45" />
      </g>
    </svg>
  );
}

export function AUFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={`rounded-[2px] ${className}`} aria-hidden>
      <rect width="20" height="14" fill="#1a2f6d" />
      <path d="M0 0l6.5 4.5M6.5 0L0 4.5" stroke="#fff" strokeWidth="0.9" />
      <rect x="2.7" y="0" width="1.1" height="4.5" fill="#fff" />
      <rect x="0" y="1.7" width="6.5" height="1.1" fill="#d92b3a" />
      <g fill="#fff">
        <circle cx="11.5" cy="3" r="0.8" />
        <circle cx="15" cy="5" r="0.8" />
        <circle cx="17.5" cy="2.2" r="0.7" />
        <circle cx="12.5" cy="9.5" r="0.8" />
        <circle cx="16" cy="8" r="0.7" />
        <circle cx="14" cy="12" r="0.7" />
      </g>
    </svg>
  );
}
