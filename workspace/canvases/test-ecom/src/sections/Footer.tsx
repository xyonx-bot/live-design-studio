import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
  const year = new Date().getFullYear()

  return (
    <footer
      className={cn(
        "w-full bg-neutral-950 text-neutral-400 border-t border-neutral-800",
        className
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-6 py-8 text-center sm:flex-row sm:justify-between">
        <p className="text-sm">
          © {year} Acme Commerce. All rights reserved.
        </p>
        <p className="text-xs text-neutral-500">
          Built with care — demo store.
        </p>
      </div>
    </footer>
  )
}
