import { Footer } from "./Footer"

export default function FooterPreview() {
  return (
    <div className="min-h-screen bg-neutral-100">
      {/* page content stands in so the footer reads in context */}
      <div className="flex min-h-[60vh] items-center justify-center text-neutral-400">
        <span className="text-sm">…page content…</span>
      </div>
      <Footer />
    </div>
  )
}
