import Button from "../components/Button";
import Badge from "../components/Badge";
import AvatarGroup from "../components/AvatarGroup";
import { PlayIcon } from "../components/Icons";
import HeroDashboard from "./HeroDashboard";

/**
 * Full hero band: left copy column (badge, headline, subtext, CTAs,
 * social proof) + right dashboard mockup.
 */
export function HeroSection() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-8 pb-24 pt-14 lg:grid-cols-2 lg:gap-10 lg:pt-20">
        {/* left column */}
        <div>
          <Badge label="Multi-currency account" />

          <h1 className="mt-6 text-5xl font-bold leading-[1.06] tracking-tight text-neutral-900 lg:text-[56px]">
            All in one App finance for your business
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-500">
            Keep your business account needs safely organized under one roof.
            Manage money quickly, easily & efficiently.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg">Try for Free</Button>
            <Button variant="outline" size="lg">
              <PlayIcon className="h-5 w-5" />
              Preview
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-3.5">
            <AvatarGroup />
            <div>
              <p className="text-sm font-semibold text-neutral-900">12k+</p>
              <p className="text-xs text-neutral-500">
                Used by teams and professionals.
              </p>
            </div>
          </div>
        </div>

        {/* right column — dashboard mockup */}
        <div className="flex justify-center lg:justify-end">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
