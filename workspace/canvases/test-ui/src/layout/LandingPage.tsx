import AnnouncementBar from "../sections/AnnouncementBar";
import HeroSection from "../sections/HeroSection";
import LogosStrip from "../sections/LogosStrip";
import Header from "./Header";

/**
 * Alva landing page shell — the whole site inside the big white
 * rounded browser-like card from the reference design.
 * The stage's gray background shows around the card.
 */
export function LandingPage() {
  return (
    <div className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-[28px] bg-white shadow-[0_40px_100px_-40px_rgba(23,24,28,0.35)]">
      <AnnouncementBar />
      <Header />
      <HeroSection />
      <LogosStrip />
    </div>
  );
}

export default LandingPage;
