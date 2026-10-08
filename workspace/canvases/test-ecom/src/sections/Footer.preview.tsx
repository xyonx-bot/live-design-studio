import { Footer } from "./Footer"

/**
 * Transparent demo sheet for the Footer section.
 * The stage provides the background — no page wrapper here.
 */
export default function FooterPreview() {
  return (
    <div className="flex w-full flex-col items-stretch gap-10 p-6">
      {/* default state */}
      <div className="overflow-hidden rounded-xl border border-dashed border-neutral-300">
        <Footer />
      </div>

      {/* customized state — different brand, fewer columns */}
      <div className="overflow-hidden rounded-xl border border-dashed border-neutral-300">
        <Footer
          brand="Studio & Co"
          tagline="Small-batch goods for slower living."
          columns={[
            {
              title: "Catalog",
              links: [{ label: "All Products" }, { label: "Bundles" }, { label: "Last Chance" }],
            },
            {
              title: "Help",
              links: [{ label: "FAQ" }, { label: "Contact" }, { label: "Wholesale" }],
            },
          ]}
          contact={[{ label: "Email", value: "care@studioandco.com", href: "#" }]}
          socials={[{ label: "Instagram", href: "#" }, { label: "Pinterest", href: "#" }]}
          copyright="© 2026 Studio & Co"
        />
      </div>
    </div>
  )
}
