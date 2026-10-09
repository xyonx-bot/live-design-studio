import BrandLogos from "../components/BrandLogos";

/** "Trusted by" partner logo strip: Slack, Zoom, Airbnb, Spotify, Envato. */
export function LogosStrip() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-8 pb-14">
        <BrandLogos />
      </div>
    </section>
  );
}

export default LogosStrip;
