import { FooterGraphy } from "./Footer.graphy"

/**
 * Transparent demo sheet for the Graphy-style footer variant.
 * The stage provides the background — no page wrapper here.
 */
export default function FooterGraphyPreview() {
  return (
    <div className="flex w-full flex-col items-stretch gap-10 p-6">
      {/* reference state — CTA card + white footer container */}
      <FooterGraphy />

      {/* footer-only state (CTA off), custom brand */}
      <FooterGraphy
        showCta={false}
        brand="Fluxo"
        description="Fluxo turns messy spreadsheets into living dashboards your whole team can read at a glance."
        socials={[{ label: "X", href: "#" }, { label: "GitHub", href: "#" }]}
        copyright="© 2026 Fluxo Labs"
      />
    </div>
  )
}
