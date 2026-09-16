import { usePageMeta } from "../lib/seo";
import { Hero } from "./sections/Hero";
import { PassBand } from "./sections/PassBand";
import { DayDemo } from "./sections/DayDemo";
import { Metrics } from "./sections/Metrics";
import { SkiSensei } from "./sections/SkiSensei";
import { Maps } from "./sections/Maps";
import { Crew } from "./sections/Crew";
import { Reviews } from "./sections/Reviews";
import { DownloadCTA } from "./sections/DownloadCTA";

/*
 * No aggregateRating here on purpose: the 4.8 and the three quotes on the page are
 * placeholder copy from the mock (design/HANDOFF.md § Placeholders). Publishing an
 * invented rating as structured data would be a misrepresentation to search engines.
 * Add it once there are real App Store numbers to cite.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tracked Out",
  applicationCategory: "SportsApplication",
  operatingSystem: "iOS",
  description:
    "Ski and snowboard tracking. Vertical, speed, turn counts and a map of every lap, plus a read on what you did well and where you're losing time.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: "Cascade Made LLC" },
};

export function Landing() {
  usePageMeta({ jsonLd: JSON_LD });

  return (
    <main>
      <Hero />
      <PassBand />
      <DayDemo />
      <Metrics />
      <SkiSensei />
      <Maps />
      <Crew />
      <Reviews />
      <DownloadCTA />
    </main>
  );
}
