import { Link } from "react-router";
import { usePageMeta } from "../lib/seo";
import { SectionHeading, Lead } from "./ui/Section";

export function NotFound() {
  usePageMeta({ title: "Page not found", description: "That page isn't here." });

  return (
    <main style={{ padding: "160px var(--gutter) 140px" }}>
      <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, letterSpacing: "0.18em", color: "var(--teal-deep)", margin: "0 0 18px" }}>
          404
        </p>
        <SectionHeading>You've skied off the map.</SectionHeading>
        <Lead>That page isn't here. The trail back to the top is below.</Lead>
        <Link
          to="/"
          style={{ display: "inline-block", marginTop: 12, fontWeight: 600, fontSize: 15, color: "var(--ink)", borderBottom: "2px solid var(--lime)", paddingBottom: 2 }}
        >
          Back to the home page →
        </Link>
      </div>
    </main>
  );
}
