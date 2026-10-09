import Header from "./Header";
import LandingPage from "./LandingPage";

/** Transparent demo sheet: Header alone, then the full page shell. */
export function LayoutsPreview() {
  return (
    <div className="flex w-full flex-col gap-10 p-6">
      <div className="flex flex-col gap-3">
        <p className="px-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Header
        </p>
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_40px_-16px_rgba(23,24,28,0.25)]">
          <Header />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="px-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
          LandingPage (full shell)
        </p>
        <LandingPage />
      </div>
    </div>
  );
}

export default LayoutsPreview;
