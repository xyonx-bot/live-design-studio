import AnnouncementBar from "./AnnouncementBar";
import HeroSection from "./HeroSection";
import LogosStrip from "./LogosStrip";

/** Transparent demo sheet mounting each section band, stacked. */
export function SectionsPreview() {
  return (
    <div className="flex w-full flex-col">
      <AnnouncementBar />
      <HeroSection />
      <LogosStrip />
    </div>
  );
}

export default SectionsPreview;
