import { useParallax } from "../../hooks/useParallax";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Eyebrow, SectionHeading, Lead } from "../ui/Section";
import screenTechnique from "../../../assets/screen-technique.webp";

export function SkiSensei() {
  const reduced = useReducedMotion();
  // The bloom is centred with translateX(-50%); parallax composes on top of it.
  const bloomRef = useParallax(0.09, { enabled: !reduced, baseTransform: "translateX(-50%)" });

  return (
    <section
      id="sensei"
      style={{ position: "relative", padding: "104px var(--gutter)", background: "var(--surface)", overflow: "hidden" }}
    >
      <div
        ref={bloomRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: -60,
          width: 900,
          height: 520,
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse at center, rgba(160,72,250,.14), rgba(245,245,247,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: "var(--content-max)", margin: "0 auto" }}>
        <Eyebrow index="02" label="Ski Sensei" color="var(--purple-deep)" />

        <div style={{ marginBottom: 52 }}>
          <SectionHeading style={{ margin: "0 0 18px" }}>
            It doesn't just record your day. It helps you learn from it.
          </SectionHeading>
          <Lead style={{ margin: 0 }}>
            Ski Sensei scores five categories every session, spots the technical gap, and gives you the drill for the
            next run. Built from the data Tracked Out already collects — no extra hardware, no video, no coach on the
            payroll.
          </Lead>
        </div>

        <div className="sensei-row">
          <div className="sensei-card">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 13px",
                borderRadius: 32,
                background: "var(--purple)",
                marginBottom: 24,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />
              <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", color: "#fff" }}>
                SKI SENSEI ANALYSIS · PALISADES TAHOE, DAY 12
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 20, margin: "0 0 22px" }}>
              {/* Coded score ring — the gap from 270deg is the unscored remainder. */}
              <div
                style={{
                  width: 96,
                  height: 96,
                  flex: "none",
                  borderRadius: "50%",
                  background:
                    "conic-gradient(from 200deg, #43EDEA 0deg, #7B7BFA 140deg, #A048FA 270deg, #E4E4E8 270deg 360deg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                role="img"
                aria-label="Session score 75 out of 100"
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 34,
                    color: "var(--ink)",
                  }}
                >
                  75
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, lineHeight: 1.1, color: "var(--ink)" }}>
                  Strong all-around day
                </div>
                <div style={{ marginTop: 4, fontSize: 16, color: "var(--muted-grey)" }}>Above your 62 season average.</div>
              </div>
            </div>

            <p className="sensei-quote" style={{ margin: "0 0 20px", fontSize: 24, lineHeight: 1.5, color: "var(--ink)" }}>
              "Left turns on beginner terrain dominate (174 turns) with a smooth average turn angle of 45.6°, but
              intermediate and advanced slopes show slightly tighter angles. Left and right turn counts are well
              balanced (318 vs. 314), indicating good symmetry."
            </p>

            <div
              style={{
                padding: "22px 24px",
                borderRadius: 20,
                background: "rgba(160,72,250,.10)",
                border: "1px solid rgba(160,72,250,.32)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", color: "var(--purple-deep)", marginBottom: 10 }}>
                RECOMMENDATION
              </div>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "#2A2A2E" }}>
                Work on increasing controlled, tighter turns on advanced terrain for more precision and carving. Focus
                on slow, methodical turns to improve edge control and maintain speed.
              </p>
            </div>
          </div>

          {/* Intentionally cropped by the frame. */}
          <div className="sensei-phone">
            <img src={screenTechnique} alt="Ski Sensei technique breakdown in the app" style={{ width: 320, maxWidth: "none", display: "block" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
