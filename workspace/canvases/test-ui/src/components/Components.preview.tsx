import Button from "./Button";
import Badge from "./Badge";
import Logo from "./Logo";
import AvatarGroup from "./AvatarGroup";
import BrandLogos from "./BrandLogos";
import { Sparkle, ArrowRight, ChevronDown, CloseX, PlayIcon } from "./Icons";

/** Transparent demo sheet: every primitive, a few states each. */
export function ComponentsPreview() {
  return (
    <div className="flex w-full flex-col gap-12 p-8">
      {/* Buttons */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Button
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg">Try for Free</Button>
          <Button variant="outline" size="lg">
            <PlayIcon className="h-5 w-5" />
            Preview
          </Button>
          <Button size="sm">Register</Button>
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button variant="ghost" size="sm">
            Dismiss
          </Button>
        </div>
      </div>

      {/* Badge */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Badge
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Badge label="Multi-currency account" />
          <Badge highlight="Pro" label="Business plan" />
          <Badge highlight="" label="No highlight variant" />
        </div>
      </div>

      {/* Logo */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Logo
        </p>
        <div className="flex flex-wrap items-center gap-8">
          <Logo />
          <Logo markOnly />
        </div>
      </div>

      {/* Avatars + social proof */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          AvatarGroup
        </p>
        <div className="flex items-center gap-3.5">
          <AvatarGroup />
          <div>
            <p className="text-sm font-semibold text-neutral-900">12k+</p>
            <p className="text-xs text-neutral-500">
              Used by teams and professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Brand logos */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          BrandLogos
        </p>
        <BrandLogos className="max-w-3xl" />
      </div>

      {/* Icons */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Icons
        </p>
        <div className="flex flex-wrap items-center gap-6 text-neutral-700">
          <Sparkle className="h-4 w-4" />
          <ArrowRight className="h-5 w-5" />
          <ChevronDown className="h-4 w-4" />
          <CloseX className="h-4 w-4" />
          <PlayIcon className="h-8 w-8" />
        </div>
      </div>
      <p className="text-sm text-neutral-400">
        Transparent sheet — the stage provides the background.
      </p>
    </div>
  );
}

export default ComponentsPreview;
