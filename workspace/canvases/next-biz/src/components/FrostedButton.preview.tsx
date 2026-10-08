import FrostedButton from './FrostedButton'

/** Transparent demo sheet for FrostedButton. Canvas paints the background. */
export default function FrostedButtonPreview() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <FrostedButton>Get Started</FrostedButton>
      <FrostedButton variant="primary">Book a Call</FrostedButton>
      <FrostedButton size="lg">Large</FrostedButton>
      <FrostedButton size="sm">Small</FrostedButton>
      <FrostedButton disabled>Disabled</FrostedButton>
      <FrostedButton>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        With Icon
      </FrostedButton>
      <FrostedButton variant="primary" style={{ borderRadius: 6, fontWeight: 600 }}>Solid-ish Tint</FrostedButton>
    </div>
  )
}
