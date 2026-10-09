import { cn } from "../lib/utils";

type BadgeProps = {
  /** Text inside the solid black segment. */
  highlight?: string;
  /** Text inside the gray segment. */
  label: string;
  className?: string;
};

/**
 * Two-tone announcement badge: black pill fused onto a light-gray pill.
 * e.g. [ New ] Multi-currency account
 */
export function Badge({ highlight = "New", label, className }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-neutral-100 p-1 pr-4",
        className
      )}
    >
      {highlight && (
        <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white">
          {highlight}
        </span>
      )}
      <span className="pl-3 text-xs font-medium text-neutral-600">{label}</span>
    </div>
  );
}

export default Badge;
