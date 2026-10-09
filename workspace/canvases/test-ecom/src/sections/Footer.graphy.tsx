import { cn } from "../lib/utils"

export type GraphyFooterLink = { label: string; href?: string }
export type GraphyFooterColumn = { title: string; links: GraphyFooterLink[] }
export type GraphyFooterSocial = { label: string; href?: string }

export type FooterGraphyProps = {
  brand?: string
  description?: string
  columns?: GraphyFooterColumn[]
  socials?: GraphyFooterSocial[]
  legal?: GraphyFooterLink[]
  copyright?: string
  /** show the black CTA card above the footer card (as in the reference) */
  showCta?: boolean
  ctaTitle?: string
  ctaSubtitle?: string
  ctaLabel?: string
  ctaHref?: string
  className?: string
}

const defaultColumns: GraphyFooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features" },
      { label: "Pricing" },
      { label: "Integrations" },
      { label: "Changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation" },
      { label: "Tutorials" },
      { label: "Blog" },
      { label: "Support" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About" },
      { label: "Careers" },
      { label: "Contact" },
      { label: "Partners" },
    ],
  },
]

const defaultSocials: GraphyFooterSocial[] = [
  { label: "X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
]

const defaultLegal: GraphyFooterLink[] = [
  { label: "Privacy Policy" },
  { label: "Terms of Service" },
  { label: "Cookies Settings" },
]

function SocialIcon({ label }: { label: string }) {
  const common = "h-[18px] w-[18px]"
  switch (label.toLowerCase()) {
    case "x":
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l10.966 15.644Z" />
        </svg>
      )
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={common}
          aria-hidden="true"
        >
          <rect width="18" height="18" x="3" y="3" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
        </svg>
      )
    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
        </svg>
      )
  }
}

export function FooterGraphy({
  brand = "Graphy",
  description = "Graphy empowers teams to transform raw data into clear, compelling visuals — making insights easier to share, understand, and act on.",
  columns = defaultColumns,
  socials = defaultSocials,
  legal = defaultLegal,
  copyright,
  showCta = true,
  ctaTitle = "Ready to transform your data?",
  ctaSubtitle = "Join thousands of data-driven professionals who are creating beautiful visualizations in minutes.",
  ctaLabel = "Start for free",
  ctaHref = "#",
  className,
}: FooterGraphyProps) {
  const year = new Date().getFullYear()

  return (
    <section
      className={cn("piece-root w-full bg-[#f2f3f5] px-4 pb-8 pt-5 md:px-6", className)}
    >
      <div className="mx-auto w-full max-w-[1152px]">
        {/* ── CTA card: black, white glow fading from the top ── */}
        {showCta && (
          <div className="relative overflow-hidden rounded-[28px] bg-[#0a0a0a] px-6 pb-16 pt-14 text-center md:pb-20 md:pt-16">
            {/* glow — brightest at the top edges, dipped at center, gone by ~30% height */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: [
                  "radial-gradient(46% 58% at 28% 0%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.08) 42%, transparent 72%)",
                  "radial-gradient(46% 58% at 72% 0%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.08) 42%, transparent 72%)",
                  "radial-gradient(64% 38% at 50% 0%, rgba(255,255,255,0.10) 0%, transparent 70%)",
                ].join(", "),
              }}
            />
            <h2 className="relative text-[26px] font-bold tracking-tight text-white md:text-4xl">
              {ctaTitle}
            </h2>
            <p className="relative mx-auto mt-3 max-w-[46ch] text-[15px] leading-relaxed text-neutral-400 md:text-[17px]">
              {ctaSubtitle}
            </p>
            <a
              href={ctaHref}
              className="relative mt-7 inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
            >
              {ctaLabel}
            </a>
          </div>
        )}

        {/* ── white outer container holding the footer card ── */}
        <div
          className={cn(
            "relative overflow-hidden rounded-[28px] bg-white",
            showCta && "mt-4"
          )}
        >
          {/* giant watermark, cropped by the container's bottom edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 z-0 -translate-x-1/2 translate-y-[46%] select-none whitespace-nowrap text-[clamp(7rem,17vw,17rem)] font-extrabold leading-none tracking-tight text-neutral-200"
          >
            {brand.toLowerCase()}
          </div>

          {/* footer card */}
          <div className="relative z-10 m-3 rounded-[22px] border border-neutral-200 bg-white p-7 md:m-5 md:p-10">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[1.7fr_1fr_1fr_1fr]">
              {/* brand block */}
              <div className="col-span-2 md:col-span-1">
                <a href="#" className="inline-flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-[7px] bg-black">
                    <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
                      <path
                        d="M7 24 14.6 0M13.4 24 21 0"
                        stroke="#fff"
                        strokeWidth="2.4"
                      />
                    </svg>
                  </span>
                  <span className="text-lg font-bold tracking-tight text-black">
                    {brand}
                  </span>
                </a>
                <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-neutral-500">
                  {description}
                </p>
                <ul className="mt-5 flex items-center gap-4">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href ?? "#"}
                        aria-label={s.label}
                        title={s.label}
                        className="text-neutral-900 transition-colors hover:text-neutral-400"
                      >
                        <SocialIcon label={s.label} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* link columns */}
              {columns.map((col) => (
                <div key={col.title}>
                  <h3 className="text-sm font-semibold text-black">{col.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href ?? "#"}
                          className="text-sm text-neutral-500 transition-colors hover:text-black"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* divider + bottom row */}
            <div className="mt-12 flex flex-col gap-3 border-t border-neutral-200/80 pt-6 md:flex-row md:items-center md:justify-between">
              <p className="text-[13px] text-neutral-500">
                {copyright ?? `© ${year} ${brand}. All rights reserved.`}
              </p>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {legal.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href ?? "#"}
                      className="text-[13px] text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FooterGraphy
