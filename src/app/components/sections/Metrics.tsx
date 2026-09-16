import { useParallax } from "../../hooks/useParallax";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Eyebrow, SectionHeading } from "../ui/Section";
import statVertical from "../../../assets/stat-vertical.webp";
import statTurnDirection from "../../../assets/stat-turndirection.webp";
import statTurnType from "../../../assets/stat-turntype.webp";
import statSpeedZones from "../../../assets/stat-speedzones.webp";
import statSessionLength from "../../../assets/stat-sessionlength.webp";

/** `span` is the 12-column grid width: two 6-wide, then three 4-wide. */
const STATS = [
  { span: 6, src: statVertical, alt: "12,855 ft total vertical, lifetime high" },
  { span: 6, src: statTurnDirection, alt: "Turn direction: 53% left, 47% right" },
  { span: 4, src: statTurnType, alt: "Turn type: carving, controlled, slalom" },
  { span: 4, src: statSpeedZones, alt: "Time in speed zones" },
  { span: 4, src: statSessionLength, alt: "Session length split: descending, ascending, resting" },
];

const FEATURES: { name: string; detail: string; free: boolean }[] = [
  { name: "Vertical & distance", detail: "Per run, per session, per season, plus vertical and distance per hour.", free: true },
  { name: "Speed", detail: "Max and average per run, filtered for GPS noise and impossible values.", free: true },
  { name: "Turn analysis", detail: "Count, direction balance, angle and type — carving, slalom or controlled — by terrain grade.", free: false },
  { name: "Slope & terrain", detail: "Max sustained slope, slope engagement, cliff drop detection, difficulty normalized across resorts.", free: false },
  { name: "Motion & effort", detail: "Runs per hour, pauses per run, time riding versus resting versus in line.", free: false },
  { name: "Trail maps", detail: "4,072 resorts on 3D terrain with satellite, run names and stats — downloadable for offline days.", free: true },
  { name: "Terrain layers", detail: "Slope shading, north-facing aspect and cliff detection, stacked over any base map.", free: false },
  { name: "Heat maps", detail: "Your track shaded by speed or slope difficulty, over 3D terrain.", free: false },
  { name: "Apple Health", detail: "Sessions written back to Health so the day counts where the rest of your training lives.", free: false },
];

export function Metrics() {
  const reduced = useReducedMotion();
  const bloomRef = useParallax(0.12, { enabled: !reduced });

  return (
    <section
      id="metrics"
      style={{ position: "relative", padding: "104px var(--gutter)", background: "var(--ink)", color: "#fff", overflow: "hidden" }}
    >
      <div
        ref={bloomRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -140,
          top: -80,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(67,237,234,.22), rgba(28,28,30,0) 68%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: "var(--content-max)", margin: "0 auto" }}>
        <Eyebrow index="01" label="Advanced metrics" color="var(--teal-bright)" />

        <div style={{ maxWidth: 1100, marginBottom: 56 }}>
          <SectionHeading color="#fff" style={{ margin: "0 0 18px" }}>
            Dozens of metrics a run. You just ski.
          </SectionHeading>
          <p style={{ margin: "0 0 14px", fontSize: 17.5, lineHeight: 1.65, color: "rgba(255,255,255,.7)" }}>
            Most trackers hand you vertical and a speed number and call it a day. Tracked Out breaks the run down: how
            you turned, where you engaged the slope, how fast you gave the vertical back, and how much of the day you
            actually spent riding.
          </p>
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: "var(--muted-warm)" }}>
            Efficient GPS and smart run detection — a full day on a fraction of your battery, no signal required.
          </p>
        </div>

        {/* Exported app components; HANDOFF.md flags these for rebuild against real data. */}
        <div className="stat-grid">
          {STATS.map((s) => (
            <div key={s.alt} className="stat-card" style={{ gridColumn: `span ${s.span}` }}>
              <img src={s.src} alt={s.alt} style={{ width: "100%", display: "block" }} />
            </div>
          ))}
        </div>

        <div className="feature-table__head">
          <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 30 }}>Everything we measure</h3>
          <span />
          <span style={{ textAlign: "center", fontWeight: 500, fontSize: 11, letterSpacing: "0.09em", color: "var(--muted-warm)" }}>FREE</span>
          <span style={{ textAlign: "center", fontWeight: 500, fontSize: 11, letterSpacing: "0.09em", color: "var(--lime)" }}>PRO PASS</span>
        </div>

        <div style={{ borderTop: "1px solid var(--dark-border)" }}>
          {FEATURES.map((f, i) => (
            <div key={f.name} className="feature-row" style={{ borderBottom: i === FEATURES.length - 1 ? "none" : "1px solid var(--dark-border-2)" }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{f.name}</span>
              <span className="feature-row__detail" style={{ fontSize: 14, color: "var(--muted-warm)" }}>{f.detail}</span>
              <span
                className="feature-row__mark"
                style={{ color: f.free ? "var(--teal-bright)" : "#44444E", fontWeight: 700, fontSize: 15 }}
                aria-label={f.free ? "Included in free" : "Not in free"}
              >
                {f.free ? "✓" : "—"}
              </span>
              <span className="feature-row__mark" style={{ color: "var(--lime)", fontWeight: 700, fontSize: 15 }} aria-label="Included in Pro Pass">
                ✓
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
