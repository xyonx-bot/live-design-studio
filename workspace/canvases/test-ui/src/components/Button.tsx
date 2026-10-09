import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
};

/**
 * Pill-shaped CTA button.
 * primary → solid black pill, white text ("Try for Free", "Register")
 * outline → white pill, thin gray border ("Preview", "Login")
 * ghost   → borderless quiet action
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full whitespace-nowrap font-medium transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
        size === "sm" && "h-9 px-5 text-sm",
        size === "md" && "h-11 px-6 text-sm",
        size === "lg" && "h-[52px] px-7 text-base",
        variant === "primary" &&
          "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]",
        variant === "outline" &&
          "border border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98]",
        variant === "ghost" && "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
