import { cn } from "../lib/utils";

export default function Button({
  children,
  variant = "frosted",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "frosted";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center font-medium text-white",
        "border border-white/25 bg-white/10 backdrop-blur-md",
        "shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.25)]",
        "transition-all duration-200 hover:bg-white/20 hover:border-white/40 active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        // squircle look: radius scales with size, ~25% of height
        size === "sm" && "px-4 py-2 text-sm rounded-[10px]",
        size === "md" && "px-6 py-3 text-base rounded-[14px]",
        size === "lg" && "px-8 py-4 text-lg rounded-[18px]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
