import { Eyebrow, SectionHeading } from "../ui/Section";

const LAYERS = [
  { label: "3D terrain", active: true },
  { label: "Satellite", active: false },
  { label: "Slope shading", active: false },
  { label: "North aspect", active: false },
  { label: "Cliff highlighting", active: false },
];

const STATS = [
  { value: "4,072", label: "RESORTS MAPPED", accent: true },
  { value: "38", label: "COUNTRIES" },
  { value: "5", label: "MAP LAYERS" },
  { value: "100%", label: "WORKS OFFLINE" },
];

export function Maps() {
  return (
    <section id="maps" style={{ position: "relative", background: "var(--ink)", color: "#fff", overflow: "hidden" }}>
      <div style={{ maxWidth: "var(--content-max)", margin: "0 auto", padding: "100px var(--gutter) 44px" }}>
        <div style={{ maxWidth: 1100 }}>
          <Eyebrow index="03" label="Maps & resorts" color="var(--teal-bright)" />
          <SectionHeading color="#fff" style={{ margin: "0 0 18px" }}>
            All of the mountains, in your pocket.
          </SectionHeading>
          <p style={{ margin: 0, maxWidth: 820, fontSize: 17.5, lineHeight: 1.65, color: "rgba(255,255,255,.7)" }}>
            Trail maps for 4,000+ resorts layered on real terrain. Tilt it, shade it by pitch, flip to satellite, tap
            any run for its numbers and your history on it — then take it all offline.
          </p>
        </div>
      </div>

      {/*
        PLACEHOLDER — the striped band stands in for a 3D resort flyover capture with
        a track overlay (2656 x 1240). This is the section's whole payload; see
        design/HANDOFF.md § Placeholders. Swap the background for the real capture.
      */}
      <div className="maps-band">
        <span className="maps-band__note">
          MAP CAPTURE · FULL-BLEED 3D RESORT FLYOVER WITH TRACK OVERLAY
          <br />
          2656 × 1240
        </span>

        <div className="maps-layers">
          {LAYERS.map((l) => (
            <div
              key={l.label}
              style={
                l.active
                  ? { padding: "13px 17px", borderRadius: 16, background: "var(--teal-bright)", color: "var(--ink-deep)", fontWeight: 700, fontSize: 13.5 }
                  : {
                      padding: "13px 17px",
                      borderRadius: 16,
                      background: "rgba(28,28,30,.82)",
                      border: "1px solid #44444E",
                      fontWeight: 600,
                      fontSize: 13.5,
                      color: "#E2E2E8",
                    }
              }
            >
              {l.label}
            </div>
          ))}
          <p style={{ margin: "6px 2px 0", fontSize: 12.5, lineHeight: 1.6, color: "#B4B4BA" }}>
            Layers stack. Slope shading over satellite is how you find the north-facing snow three days after a storm.
          </p>
        </div>

        <div className="maps-run">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ width: 13, height: 13, background: "#fff", transform: "rotate(45deg)" }} aria-hidden="true" />
            <span style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>Gandy's Right</span>
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.75, color: "#B4B4BA" }}>
            1,240 ft vertical · 0.7 mi
            <br />
            Max sustained pitch 38.4°
            <br />
            North-facing, holds snow
            <br />
            <span style={{ color: "var(--teal-bright)", fontWeight: 600 }}>You've skied it 14× · best 2:08</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "var(--content-max)", margin: "0 auto", padding: "60px var(--gutter) 104px" }}>
        <div className="maps-lower">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: "0 0 14px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(30px, 3.2vw, 40px)", lineHeight: 1.05 }}>
              4,072 resorts. Including yours.
            </h3>
            <p style={{ margin: "0 0 12px", fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,.72)" }}>
              Every Epic, Ikon, Mountain Collective and Indy mountain is in here, alongside the two-lift community hill
              an hour from your house that no other app bothered to map. Search by name, pass or region, favorite what
              you ride, and download it for the days the mountain has no bars.
            </p>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "var(--muted-warm)" }}>
              Tracking, trail names and stats all keep working in airplane mode.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "15px 20px",
                borderRadius: 32,
                background: "var(--dark-card)",
                border: "1px solid var(--dark-border)",
                marginTop: 24,
                maxWidth: 420,
              }}
            >
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--teal-bright)" }} aria-hidden="true" />
              <span style={{ fontSize: 15, color: "var(--muted-warm)" }}>Search 4,072 resorts…</span>
            </div>
          </div>

          <div className="maps-stats">
            {STATS.map((s) => (
              <div key={s.label} style={{ padding: 22, background: "var(--dark-card)", border: "1px solid var(--dark-border)", borderRadius: 20 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 38, lineHeight: 1, color: s.accent ? "var(--teal-bright)" : undefined }}>
                  {s.value}
                </div>
                <div style={{ fontWeight: 500, fontSize: 10.5, letterSpacing: "0.09em", color: "var(--muted-warm)", marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
