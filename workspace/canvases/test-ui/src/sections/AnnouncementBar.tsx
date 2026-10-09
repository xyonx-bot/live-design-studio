import { useState } from "react";
import { Sparkle, ArrowRight, CloseX } from "../components/Icons";

/**
 * Slim centered announcement pill above the header.
 * Text kept exactly as the source template (incl. the "Lear More" typo).
 */
export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex max-w-6xl justify-center px-8 pt-6">
        <div className="inline-flex items-center gap-2.5 rounded-full bg-neutral-100 py-2 pl-4 pr-2 text-sm shadow-sm">
          <Sparkle className="h-4 w-4 shrink-0 text-neutral-500" />
          <span className="font-medium text-neutral-700">
            Big news, we reduced our fees
          </span>
          <a
            href="#"
            className="inline-flex items-center gap-1 font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-600"
          >
            Lear More
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            aria-label="Dismiss announcement"
            onClick={() => setOpen(false)}
            className="ml-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700"
          >
            <CloseX className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default AnnouncementBar;
