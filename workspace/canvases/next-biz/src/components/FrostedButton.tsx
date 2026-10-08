import { cn } from "../lib/utils";

type FrostedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary";
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export function FrostedButton({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: FrostedButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-[6px]",
        "font-medium tracking-wide whitespace-nowrap select-none",
        "backdrop-blur-md backdrop-saturate-150",
        "border border-white/40 dark:border-white/20",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_24px_-8px_rgba(0,0,0,0.35)]",
        "transition-all duration-200 ease-out",
        "active:translate-y-px active:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_12px_-8px_rgba(0,0,0,0.3)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/60",
        sizes[size],
        variant === "primary"
          ? "bg-[#b9ed46]/25 text-neutral-900 hover:bg-[#b9ed46]/40 border-[#b9ed46]/50"
          : "bg-white/10 text-white hover:bg-white/20",
        "disabled:opacity-40 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default FrostedButton;
