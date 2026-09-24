import { useEffect, useRef, useState } from "react";
import { useParallax } from "../../hooks/useParallax";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PlanMap } from "../ui/PlanMap";
import phone from "../../../assets/hero-phone-trim.webp";
import { trackEvent } from "../../analytics";

/** Chapter duration, and the tick that drives the progress rails. */
const DURATION = 5200;
const TICK = 90;

const CHAPTERS = [
  { index: "01", title: "Plan the day", sub: "Forecast, offline maps, favorites" },
  { index: "02", title: "On the hill", sub: "Auto sessions, live coaching, crew" },
  { index: "03", title: "Relive your day", sub: "Recap, photo book, season stats" },
];

const chipStyle = {
  padding: "7px 14px",
  border: "1px solid var(--hairline-strong)",
  borderRadius: 32,
  fontWeight: 600,
  fontSize: 12,
  color: "var(--body-grey)",
} as const;

function Chips({ items, accent }: { items: string[]; accent?: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((label) =>
        label === accent ? (
          <span
            key={label}
            style={{ padding: "7px 14px", borderRadius: 32, background: "rgba(160,72,250,.12)", fontWeight: 600, fontSize: 12, color: "var(--purple-deep)" }}
          >
            {label}
          </span>
        ) : (
          <span key={label} style={chipStyle}>
            {label}
          </span>
        ),
      )}
    </div>
  );
}

function Eyebrow({ children, color }: { children: string; color: string }) {
  return (
    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, letterSpacing: "0.1em", color, marginBottom: 14 }}>
      {children}
    </div>
  );
}

function ChapterHeading({ children }: { children: string }) {
  return (
    <h3 style={{ margin: "0 0 16px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1.05 }}>
      {children}
    </h3>
  );
}

function ChapterCopy({ children }: { children: string }) {
  return <p style={{ margin: "0 0 26px", maxWidth: 520, fontSize: 16, lineHeight: 1.65, color: "var(--body-grey)" }}>{children}</p>;
}

function ChapterOne() {
  return (
    <div className="demo-chapter">
      <div style={{ flex: 1, minWidth: 0 }}>
        <Eyebrow color="var(--teal-deep)">6:42 AM</Eyebrow>
        <ChapterHeading>Pick the hill that's actually going off</ChapterHeading>
        <ChapterCopy>
          Five-day powder forecast and storm alerts sort out where to go. Favorite the mountain, pull the map offline
          for the drive, then scout the glades and cliff bands in the trail explorer before you're standing on top of
          them.
        </ChapterCopy>
        <Chips items={["5-day forecast", "Storm alerts", "Offline maps", "Trail explorer"]} />
      </div>
      <PlanMap />
    </div>
  );
}

function LiveStat({ value, unit, label, color }: { value: string; unit?: string; label: string; color?: string }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 34, lineHeight: 1, color }}>
        {value}
        {unit && <span style={{ fontSize: 15, color: "var(--muted-warm)" }}> {unit}</span>}
      </div>
      <div style={{ marginTop: 5, fontWeight: 500, fontSize: 9.5, letterSpacing: "0.09em", color: "var(--muted-warm)" }}>{label}</div>
    </div>
  );
}

function ChapterTwo() {
  return (
    <div className="demo-chapter">
      <div style={{ flex: 1, minWidth: 0 }}>
        <Eyebrow color="var(--purple)">10:04 AM · RUN 7</Eyebrow>
        <ChapterHeading>Drop in. It's already recording.</ChapterHeading>
        <ChapterCopy>
          Sessions start themselves when you get to the hill. Sensei calls out your turn balance between laps, live
          stats sit on the lock screen, and the crew shows up on the map so you always know roughly where everyone is.
        </ChapterCopy>
        <Chips items={["Auto sessions", "Live Activity", "Realtime coaching", "Crew map · beta"]} accent="Crew map · beta" />
      </div>

      {/* Coded marketing mocks, not screenshots. */}
      <div className="demo-aside" style={{ width: 360, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ padding: "18px 20px", borderRadius: 22, background: "var(--ink-deep)", color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--lime)" }} />
              <span style={{ fontWeight: 600, fontSize: 10.5, letterSpacing: "0.1em", color: "var(--lime)" }}>TRACKING · RUN 7</span>
            </div>
            <span style={{ fontSize: 11, color: "var(--muted-warm)" }}>LIVE ACTIVITY</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 22, marginTop: 14 }}>
            <LiveStat value="1,731" unit="ft" label="VERTICAL" color="var(--teal-bright)" />
            <LiveStat value="29.4" label="MPH NOW" />
            <LiveStat value="7" label="RUNS" />
          </div>
        </div>

        <div style={{ padding: "18px 20px", borderRadius: 22, border: "1px solid var(--hairline)", background: "var(--surface)" }}>
          <div style={{ fontWeight: 600, fontSize: 10.5, letterSpacing: "0.1em", color: "var(--purple-deep)", marginBottom: 8 }}>
            SENSEI · BETWEEN RUNS
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "#2A2A2E" }}>
            "Turns balanced 32 left, 34 right. Descent rate 245 ft/min — hold that edge one beat longer on the steeps."
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 22, border: "1px solid var(--hairline)" }}>
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#FFFA00,#C6EE7A)" }} />
          <span style={{ width: 26, height: 26, borderRadius: "50%", marginLeft: -14, background: "linear-gradient(135deg,#43EDEA,#A048FA)" }} />
          <span style={{ width: 26, height: 26, borderRadius: "50%", marginLeft: -14, background: "linear-gradient(135deg,#FF02E6,#FFFA00)" }} />
          <span style={{ marginLeft: 6, fontSize: 12.5, color: "var(--body-grey)" }}>Crew is on Rainier Express</span>
        </div>
      </div>
    </div>
  );
}

function ChapterThree() {
  return (
    <div className="demo-chapter">
      <div style={{ flex: 1, minWidth: 0 }}>
        <Eyebrow color="#C08A00">4:15 PM · LAST CHAIR</Eyebrow>
        <ChapterHeading>Your day, run by run</ChapterHeading>
        <ChapterCopy>
          Vertical, runs, every trail by name, and the photos you shot without meaning to. Flag the ones that were
          special, fire off the share card, export the GPX, then watch the season stack up against every season before
          it.
        </ChapterCopy>
        <Chips items={["Session recap", "Photo book", "Share card", "GPX export"]} />
      </div>
      {/* Positioned to crop at the panel's bottom edge. */}
      <div className="demo-aside demo-aside--phone" style={{ width: 330, position: "relative", alignSelf: "stretch", marginBottom: -44 }}>
        <img
          src={phone}
          alt="Session recap on iPhone"
          style={{
            position: "absolute",
            left: "50%",
            top: 10,
            width: 330,
            maxWidth: "none",
            marginLeft: -165,
            display: "block",
            filter: "drop-shadow(0 24px 48px rgba(28,28,30,.26))",
          }}
        />
      </div>
    </div>
  );
}

const PANELS = [ChapterOne, ChapterTwo, ChapterThree];

export function DayDemo() {
  const reduced = useReducedMotion();
  const bloomRef = useParallax(0.08, { enabled: !reduced });

  const [phase, setPhase] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  // Clicking a tab hands control to the reader; autoplay doesn't resume.
  const [playing, setPlaying] = useState(true);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!playing || reduced) return;
    startedAt.current = Date.now();
    const id = setInterval(() => {
      const e = Date.now() - startedAt.current;
      if (e >= DURATION) {
        startedAt.current = Date.now();
        setElapsed(0);
        setPhase((p) => (p + 1) % PANELS.length);
      } else {
        setElapsed(e);
      }
    }, TICK);
    return () => clearInterval(id);
  }, [playing, reduced, phase]);

  const select = (i: number) => {
    setPhase(i);
    setElapsed(0);
    setPlaying(false);
    // Only the tabs call this. Autoplay advances `phase` directly, so what
    // lands in GA is someone choosing a chapter, not the carousel ticking.
    trackEvent("demo_chapter_select", { chapter: CHAPTERS[i].title });
  };

  const frac = playing && !reduced ? Math.min(1, elapsed / DURATION) : 1;
  const Panel = PANELS[phase];

  return (
    <section id="day" style={{ position: "relative", padding: "104px var(--gutter)", overflow: "hidden" }}>
      <div
        ref={bloomRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -200,
          top: 120,
          width: 620,
          height: 620,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(160,72,250,.13), rgba(245,245,247,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: "var(--content-max)", margin: "0 auto" }}>
        <div style={{ marginBottom: 38, maxWidth: 1100 }}>
          <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "0.14em", color: "var(--muted-grey)", marginBottom: 12 }}>
            A DAY WITH TRACKED OUT
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(40px, 5.6vw, 76px)",
              lineHeight: 0.98,
              letterSpacing: "-0.01em",
            }}
          >
            From the parking lot to last chair
          </h2>
        </div>

        <div className="demo-tabs" role="tablist" aria-label="A day with Tracked Out">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.index}
              type="button"
              role="tab"
              id={`day-tab-${i}`}
              aria-selected={phase === i}
              aria-controls="day-panel"
              onClick={() => select(i)}
              className="demo-tab"
            >
              <div style={{ height: 3, background: "var(--hairline)", borderRadius: 3, overflow: "hidden" }}>
                <div
                  className="demo-rail__fill"
                  style={{
                    height: 3,
                    borderRadius: 3,
                    background: phase === i ? "var(--ink)" : "#C6C6CC",
                    width: `${phase === i ? frac * 100 : phase > i ? 100 : 0}%`,
                    transition: "width .14s linear, background-color .3s ease",
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 14 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.14em", color: "#636366" }}>
                  {c.index}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 22,
                    lineHeight: 1.1,
                    color: phase === i ? "var(--ink)" : "#6B6B70",
                    transition: "color .3s ease",
                  }}
                >
                  {c.title}
                </span>
              </div>
              <div style={{ marginTop: 4, fontSize: 13.5, color: phase === i ? "var(--body-grey)" : "#767679", transition: "color .3s ease" }}>
                {c.sub}
              </div>
            </button>
          ))}
        </div>

        <div
          id="day-panel"
          role="tabpanel"
          aria-labelledby={`day-tab-${phase}`}
          className="demo-panel-frame"
        >
          {/* Keyed so the entrance animation replays on every chapter change. */}
          <div key={phase} className="demo-panel" style={{ height: "100%" }}>
            <Panel />
          </div>
        </div>
      </div>
    </section>
  );
}
