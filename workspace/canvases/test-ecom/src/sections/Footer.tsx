import { useId } from "react"
import { cn } from "../lib/utils"
import { NewsletterForm } from "../components/NewsletterForm"

export type FooterLink = { label: string; href?: string }

export type FooterColumn = {
  title: string
  links: FooterLink[]
}

export type FooterProps = {
  brand?: string
  tagline?: string
  columns?: FooterColumn[]
  socials?: { label: string; href?: string }[]
  contact?: { label: string; value: string; href?: string }[]
  legal?: FooterLink[]
  copyright?: string
  /** explicit id for the newsletter input (auto-generated when omitted) */
  newsletterId?: string
  className?: string
}

const defaultColumns: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals" },
      { label: "Best Sellers" },
      { label: "Collections" },
      { label: "Sale" },
      { label: "Gift Cards" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center" },
      { label: "Track Order" },
      { label: "Returns" },
      { label: "Shipping Info" },
      { label: "Size Guide" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us" },
      { label: "Careers" },
      { label: "Sustainability" },
      { label: "Press" },
      { label: "Affiliates" },
    ],
  },
]

const defaultSocials = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Pinterest", href: "#" },
]

const defaultContact = [
  { label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
  { label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
]

const defaultLegal = [
  { label: "Privacy Policy" },
  { label: "Terms of Service" },
  { label: "Cookie Settings" },
]

function FooterLinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#f4f4ee]">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href ?? "#"}
              className={cn(
                "text-sm text-[#a1a1aa] transition-colors",
                "hover:text-[#f4f4ee] hover:underline hover:decoration-[#b9ed46] hover:decoration-2 hover:underline-offset-4"
              )}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer({
  brand = "Acme Commerce",
  tagline = "Everyday essentials, thoughtfully made and delivered to your door.",
  columns = defaultColumns,
  socials = defaultSocials,
  contact = defaultContact,
  legal = defaultLegal,
  copyright,
  newsletterId,
  className,
}: FooterProps) {
  const year = new Date().getFullYear()
  const autoId = useId()
  const nid = newsletterId ?? autoId

  return (
    <footer className={cn("piece-root w-full bg-[#17181c] text-[#f4f4ee]", className)}>
      {/* ruled band under top edge */}
      <div className="h-px w-full bg-white/10" />

      {/* main footer content */}
      <div className="mx-auto w-full max-w-[1200px] px-6 py-14 md:px-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-12">
          {/* brand block */}
          <div className="col-span-2 md:col-span-4">
            <a href="#" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#b9ed46]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-[#17200e]"
                  aria-hidden="true"
                >
                  <path
                    d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-lg font-bold tracking-tight text-[#f4f4ee]">{brand}</span>
            </a>
            <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-[#a1a1aa]">
              {tagline}
            </p>
            <ul className="mt-5 space-y-1.5">
              {contact.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href ?? "#"}
                    className="text-sm text-[#a1a1aa] transition-colors hover:text-[#f4f4ee]"
                  >
                    <span className="font-medium text-[#f4f4ee]">{c.label}:</span> {c.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* link columns */}
          {columns.map((col) => (
            <div key={col.title} className="col-span-1 md:col-span-2">
              <FooterLinkColumn title={col.title} links={col.links} />
            </div>
          ))}

          {/* newsletter + social */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#f4f4ee]">
              Stay in the loop
            </h3>
            <p className="mt-4 text-sm text-[#a1a1aa]">
              New drops, early access, members-only offers.
            </p>
            <NewsletterForm id={nid} tone="dark" className="mt-4" />
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href ?? "#"}
                  aria-label={s.label}
                  title={s.label}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-[6px] border border-white/15",
                    "text-[#a1a1aa] transition-colors",
                    "hover:border-[#b9ed46] hover:bg-[#b9ed46] hover:text-[#17200e]"
                  )}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* bottom bar — copyright line */}
      <div className="border-t border-white/10 bg-[#12130a]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-3 px-6 py-4 text-sm md:flex-row md:px-10">
          <p className="text-[#b9ed46]">
            {copyright ?? `© ${year} ${brand}. All rights reserved.`}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {legal.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href ?? "#"}
                  className="text-[#b9ed46]/80 transition-colors hover:text-[#b9ed46] hover:underline hover:decoration-[#b9ed46]/50 hover:underline-offset-4"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
