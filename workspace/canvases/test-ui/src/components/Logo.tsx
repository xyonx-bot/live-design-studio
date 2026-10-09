import { cn } from "../lib/utils";

type LogoProps = {
  className?: string;
  /** Render just the square mark, without the "Alva" wordmark. */
  markOnly?: boolean;
};

/** Alva logo: black rounded square with a white stylized "a" swirl + wordmark. */
export function Logo({ className, markOnly = false }: LogoProps) {
  return (
    <a href="#" className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-neutral-900">
        <svg viewBox="0 0 36 36" className="h-5 w-5" aria-hidden>
          <path
            d="M25 21a8 8 0 1 0-8-8c0 4 2.5 6.5 6 7.5"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {!markOnly && (
        <span className="text-xl font-semibold tracking-tight text-neutral-900">
          Alva
        </span>
      )}
    </a>
  );
}

export default Logo;
