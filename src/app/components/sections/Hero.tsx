import { CTAButton } from "../ui/CTAButton";
import { useParallax } from "../../hooks/useParallax";
import { useHeroFade } from "../../hooks/useHeroFade";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import phone from "../../../assets/hero-phone-trim.webp";
import statTurnType from "../../../assets/stat-turntype.webp";
import statOverview from "../../../assets/stat-overview-rows.webp";
import statSpeedZones from "../../../assets/stat-speedzones.webp";

export function Hero() {
  const reduced = useReducedMotion();
  const par = { enabled: !reduced };

  const bloomRef = useParallax(0.1, par);
  const textureRef = useParallax(0.05, par);
  const phoneRef = useParallax(0.07, par);
  const cardARef = useParallax(0.22, par);
  const cardBRef = useParallax(0.3, par);
  const cardCRef = useParallax(0.16, par);
  const floatsRef = useHeroFade(!reduced);

  return (
    // -84px pulls the hero up behind the transparent header.
    <section style={{ position: "relative", marginTop: -84, padding: "120px var(--gutter) 0", overflow: "hidden" }}>
      <div
        ref={bloomRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -120,
          right: -160,
          width: 760,
          height: 760,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(67,237,234,.30), rgba(198,238,122,.16) 45%, rgba(245,245,247,0) 72%)",
          pointerEvents: "none",
        }}
      />
      <div
        ref={textureRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 820,
          background: "repeating-linear-gradient(115deg, rgba(28,28,30,.028) 0 1px, transparent 1px 26px)",
          pointerEvents: "none",
        }}
      />

      <div
        className="hero-grid"
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          gap: 40,
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          top: 60,
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: "1 1 420px", minWidth: 0, paddingBottom: 96 }}>
          <h1
            className="hero-h1"
            style={{
              margin: "0 0 20px",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(56px, 7vw, 104px)",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
              textWrap: "balance",
            }}
          >
            Send it.
            <br />
            We'll do
            <br />
            the{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00B5B2, #7FBF1F)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              math.
            </span>
          </h1>

          <p style={{ margin: "0 0 32px", maxWidth: 440, fontSize: 17, lineHeight: 1.6, color: "var(--body-grey)" }}>
            Turn on tracking at the first chair and forget about it. You get vertical, speed, turn counts and a map of
            every lap — plus a read on what you did well and where you're losing time.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <CTAButton placement="hero" campaign="webLanding" />
            <a
              href="#day"
              style={{
                fontWeight: 600,
                fontSize: 15,
                color: "var(--ink)",
                borderBottom: "2px solid var(--lime)",
                paddingBottom: 2,
              }}
            >
              See a full day →
            </a>
          </div>
        </div>

        <div className="hero-stage" style={{ position: "relative", flex: "1 1 460px", minWidth: 0, maxWidth: 640, height: 740 }}>
          <div ref={phoneRef} className="hero-phone">
            {/* The export is transparent with no baked shadow, so the shadow is CSS. */}
            <img src={phone} alt="Tracked Out session recap on iPhone" className="hero-phone__img" />
          </div>

          {/* Exported app components. HANDOFF.md flags these for rebuild as real
              components — they're flat images and won't scale or theme. */}
          <div ref={floatsRef} className="hero-floats" style={{ transition: "opacity .3s" }}>
            <div ref={cardARef} style={{ position: "absolute", left: -186, top: 200, width: 310 }}>
              <div className="glass glass--a">
                <img src={statTurnType} alt="Turn type: 46% carving, 34% controlled, 20% slalom" style={{ width: "100%", display: "block" }} />
              </div>
            </div>
            <div ref={cardBRef} style={{ position: "absolute", right: -90, top: 30, width: 340 }}>
              <div className="glass glass--b">
                <img src={statOverview} alt="Runs, duration, max speed and distance with season and lifetime highs" style={{ width: "100%", display: "block" }} />
              </div>
            </div>
            <div ref={cardCRef} style={{ position: "absolute", left: 440, bottom: 40, width: 330 }}>
              <div className="glass glass--c">
                <img src={statSpeedZones} alt="Time in speed zones: cruise, flow, charge, send" style={{ width: "100%", display: "block" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
