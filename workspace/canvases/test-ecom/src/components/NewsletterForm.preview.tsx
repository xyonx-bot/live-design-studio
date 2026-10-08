import { NewsletterForm } from "./NewsletterForm"

/**
 * Transparent demo sheet for NewsletterForm.
 * The stage provides the background.
 */
export default function NewsletterFormPreview() {
  return (
    <div className="flex w-full flex-col items-start gap-8 p-6">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            stacked (footer default)
          </p>
          <NewsletterForm id="nl-stacked" />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            compact row
          </p>
          <NewsletterForm id="nl-compact" compact buttonLabel="Join" />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            dark tone (on dark background)
          </p>
          <div className="rounded-xl bg-[#17181c] p-5">
            <NewsletterForm id="nl-dark" compact buttonLabel="Notify me" tone="dark" />
          </div>
        </div>
      </div>
    </div>
  )
}
