import { cn } from "../lib/utils";

/**
 * FrostedButton — SMOKED variant
 * Dark smoked-glass take on the frosted button: near-black translucent pane,
 * strong blur + saturation, whisper-thin light border, subtle top edge glow.
 * Feels heavier/moodier than the default white frost — reads best on bright
 * or colorful backdrops.
 */

type SmokedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary";
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export function SmokedButton({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: SmokedButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-[6px]",
        "font-medium tracking-wide whitespace-nowrap select-none",
        "backdrop-blur-lg backdrop-saturate-150",
        "border border-white/15 dark:border-white/10",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_-12px_rgba(0,0,0,0.6)]",
        "transition-all duration-200 ease-out",
        "active:translate-y-px active:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_6px_16px_-10px_rgba(0,0,0,0.55)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70",
        sizes[size],
        variant === "primary"
          ? "bg-[#b9ed46]/15 text-[#d8f56f] hover:bg-[#b9ed46]/25 border-[#b9ed46]/30 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_28px_rgba(185,237,70,0.25)]"
          : "bg-black/35 text-white/90 hover:bg-black/45 hover:border-white/25 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_16px_36px_-12px_rgba(0,0,0,0.65)]",
        "disabled:opacity-40 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default function FrostedButtonSmokedPreview() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'center', padding: 32 }}>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <SmokedButton>Get Started</SmokedButton>
        <SmokedButton variant="primary">Book a Call</SmokedButton>
        <SmokedButton size="lg">Large</SmokedButton>
        <SmokedButton size="sm">Small</SmokedButton>
        <SmokedButton disabled>Disabled</SmokedButton>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <SmokedButton>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          With Icon
        </SmokedButton>
        <SmokedButton variant="primary" className="font-semibold">
          Glow Tint
        </SmokedButton>
      </div>
    </div>
  );
}
