import { Eyebrow, SectionHeading } from "../ui/Section";
import { ResortMap } from "../ui/ResortMap";

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

      <ResortMap />

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
