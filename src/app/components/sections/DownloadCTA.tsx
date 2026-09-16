import { CTAButton } from "../ui/CTAButton";

export function DownloadCTA() {
  return (
    <section id="get" style={{ position: "relative", padding: "56px var(--gutter)", overflow: "hidden", background: "var(--brand-gradient)" }}>
      <div className="get-band">
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-script)",
            fontWeight: 400,
            fontSize: "clamp(72px, 9vw, 116px)",
            lineHeight: 0.86,
            letterSpacing: "0.01em",
            color: "var(--ink)",
          }}
        >
          Go Track
        </h2>

        <div className="get-band__right">
          <p style={{ margin: 0, maxWidth: 360, fontSize: 16, lineHeight: 1.5, color: "#2A2A2E" }}>
            Free, no account. First chair tomorrow, first recap tomorrow night.
          </p>
          <CTAButton variant="inverted" placement="footer_band" campaign="webLanding" />
        </div>
      </div>
    </section>
  );
}
