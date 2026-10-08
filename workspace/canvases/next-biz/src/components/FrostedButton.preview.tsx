import FrostedButton from "./FrostedButton";

export default function FrostedButtonPreview() {
  return (
    <div className="relative min-h-[480px] overflow-hidden flex flex-col items-center justify-center gap-10 p-10">
      {/* colorful backdrop so the frosted effect is actually visible */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 20% 10%, #7c3aed 0%, transparent 60%), radial-gradient(1000px 700px at 85% 20%, #ec4899 0%, transparent 55%), radial-gradient(900px 800px at 50% 100%, #0ea5e9 0%, transparent 60%), linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
        }}
      />

      <div className="flex flex-wrap items-center justify-center gap-4">
        <FrostedButton>Get Started</FrostedButton>
        <FrostedButton variant="primary">Book a Call</FrostedButton>
        <FrostedButton size="lg" className="backdrop-blur-xl">
          Large
        </FrostedButton>
        <FrostedButton size="sm">Small</FrostedButton>
        <FrostedButton disabled>Disabled</FrostedButton>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <FrostedButton>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          With Icon
        </FrostedButton>
        <FrostedButton variant="primary" className="rounded-[6px] font-semibold">
          Solid-ish Tint
        </FrostedButton>
      </div>
    </div>
  );
}
