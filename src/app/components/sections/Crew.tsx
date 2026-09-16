import type { ReactNode } from "react";
import { SectionHeading, Lead } from "../ui/Section";
import { CREW_BETA_URL } from "../../config";
import { trackEvent } from "../../analytics";

const AVATARS = {
  lime: "linear-gradient(135deg,#FFFA00,#C6EE7A)",
  teal: "linear-gradient(135deg,#43EDEA,#A048FA)",
  magenta: "linear-gradient(135deg,#FF02E6,#FFFA00)",
  mint: "linear-gradient(135deg,#C6EE7A,#43EDEA)",
} as const;

function Avatar({ tone, size = 24 }: { tone: keyof typeof AVATARS; size?: number }) {
  return <span aria-hidden="true" style={{ width: size, height: size, borderRadius: "50%", background: AVATARS[tone], flex: "none" }} />;
}

function CrewRow({
  eyebrow,
  eyebrowColor,
  heading,
  body,
  aside,
  reverse,
}: {
  eyebrow: string;
  eyebrowColor: string;
  heading: string;
  body: ReactNode;
  aside: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className={`crew-row ${reverse ? "crew-row--reverse" : ""}`}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: "0.12em", color: eyebrowColor, marginBottom: 12 }}>{eyebrow}</div>
        <h3 style={{ margin: "0 0 14px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(28px, 3vw, 38px)", lineHeight: 1.05 }}>
          {heading}
        </h3>
        {body}
      </div>
      {aside}
    </div>
  );
}

const ROSTER = [
  { name: "Elroy", tone: "lime", seen: "now", fresh: true },
  { name: "Britt", tone: "teal", seen: "now", fresh: true },
  { name: "Dana", tone: "magenta", seen: "3m", fresh: false },
  { name: "Papa", tone: "mint", seen: "41m", fresh: false },
] as const;

const BOARD = [
  { rank: 1, name: "Elroy J.", tone: "lime", runs: "14 runs", vert: "21,400", you: false },
  { rank: 2, name: "You", tone: "teal", runs: "12 runs", vert: "19,880", you: true },
  { rank: 3, name: "Britt N.", tone: "magenta", runs: "11 runs", vert: "17,210", you: false },
  { rank: 4, name: "Papa Shredder", tone: "mint", runs: "9 runs", vert: "15,940", you: false },
] as const;

const GUARANTEES = [
  "Off by default — you turn it on for the day",
  "Location shared only with the code, only while lifts run",
  "Nothing retained after the day ends",
];

export function Crew() {
  return (
    <section id="crew" style={{ position: "relative", padding: "104px var(--gutter)", background: "#fff", overflow: "hidden" }}>
      <div style={{ position: "relative", maxWidth: "var(--content-max)", margin: "0 auto" }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, letterSpacing: "0.18em", color: "var(--magenta)" }}>
              04 / YOUR CREW
            </span>
            <span
              style={{
                padding: "4px 11px",
                borderRadius: 32,
                background: "linear-gradient(135deg,#FFFA00,#FF02E6)",
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.1em",
                color: "var(--ink)",
              }}
            >
              BETA
            </span>
          </div>
          <SectionHeading style={{ margin: "0 0 18px", maxWidth: "none" }}>Nobody's waiting at the bottom anymore</SectionHeading>
          <Lead style={{ margin: 0 }}>
            Six people, three abilities, two radios that don't work. Crew turns the group text into something that
            actually functions on a mountain: see where everybody is, know who's lapping what, and settle the vertical
            argument with numbers at the end of the day. Opt in per day, off by default, gone at last chair.
          </Lead>
        </div>

        <CrewRow
          eyebrow="LIVE CREW MAP"
          eyebrowColor="var(--magenta)"
          heading="Stop burning laps looking for people"
          body={
            <>
              <p style={{ margin: "0 0 12px", fontSize: 16, lineHeight: 1.7, color: "var(--body-grey)" }}>
                Everyone who's opted in shows up on the trail map, on the real terrain, with the run they're on and how
                long ago they moved. You can tell the difference between "on the chair behind you" and "went to the
                lodge forty minutes ago" without sending a single text.
              </p>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "var(--muted-grey)" }}>
                Tap a name to see their last run and pick a lift to meet at.
              </p>
            </>
          }
          aside={
            /* PLACEHOLDER — crew pins on a trail map (1120 x 720). See design/HANDOFF.md. */
            <div className="crew-aside crew-map">
              <span style={{ position: "absolute", left: 20, bottom: 20, fontWeight: 500, fontSize: 11, lineHeight: 1.7, letterSpacing: "0.12em", color: "var(--muted-grey)" }}>
                MAP CAPTURE · CREW PINS ON TRAIL MAP
                <br />
                1120 × 720
              </span>
              <div className="crew-roster">
                <div style={{ fontWeight: 500, fontSize: 10, letterSpacing: "0.09em", color: "var(--muted-grey)", marginBottom: 12 }}>ON THE HILL · 4</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {ROSTER.map((r) => (
                    <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Avatar tone={r.tone} />
                      <span style={{ flex: 1, fontWeight: 600, fontSize: 12.5 }}>{r.name}</span>
                      <span style={{ fontSize: 10.5, color: r.fresh ? "var(--green-text)" : "var(--muted-grey)" }}>{r.seen}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        />

        <CrewRow
          reverse
          eyebrow="LEADERBOARDS"
          eyebrowColor="var(--purple-deep)"
          heading="Settle it with numbers"
          body={
            <>
              <p style={{ margin: "0 0 12px", fontSize: 16, lineHeight: 1.7, color: "var(--body-grey)" }}>
                Vertical, runs, top speed, time on snow — ranked for the day, the trip or the whole season. It's the
                same data your session already collects, just pointed at your friends instead of your own history.
              </p>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "var(--muted-grey)" }}>
                Nobody gets to claim 30,000 feet on a day the lifts opened at eleven.
              </p>
            </>
          }
          aside={
            <div className="crew-aside crew-board">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 500, fontSize: 11, letterSpacing: "0.09em", color: "var(--muted-grey)" }}>TODAY · VERTICAL</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {["DAY", "TRIP", "SEASON"].map((seg, i) => (
                    <span
                      key={seg}
                      style={
                        i === 0
                          ? { padding: "5px 11px", borderRadius: 32, background: "var(--ink)", color: "#fff", fontWeight: 600, fontSize: 10.5 }
                          : { padding: "5px 11px", borderRadius: 32, background: "#fff", border: "1px solid var(--hairline-strong)", fontWeight: 600, fontSize: 10.5, color: "var(--body-grey)" }
                      }
                    >
                      {seg}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {BOARD.map((r) => (
                  <div
                    key={r.rank}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      ...(r.you ? { padding: "10px 12px", margin: "-10px -12px", borderRadius: 16, background: "#fff" } : {}),
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: r.you ? "var(--teal-deep)" : "var(--muted-grey)", width: 20 }}>
                      {r.rank}
                    </span>
                    <Avatar tone={r.tone} size={34} />
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{r.name}</span>
                    <span style={{ fontSize: 12, color: "var(--muted-grey)" }}>{r.runs}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, width: 78, textAlign: "right", color: r.you ? "var(--teal-deep)" : undefined }}>
                      {r.vert}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        <CrewRow
          eyebrow="DAY PASSES"
          eyebrowColor="var(--teal-deep)"
          heading="Sharing that turns itself off"
          body={
            <>
              <p style={{ margin: "0 0 12px", fontSize: 16, lineHeight: 1.7, color: "var(--body-grey)" }}>
                Crew works on day passes. You share a code with the people you're riding with, it lasts until last
                chair, and then it's over — nobody stays on your map for the rest of the season because you went skiing
                together once in December.
              </p>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "var(--muted-grey)" }}>
                No accounts, no friend graph, no follower count. Your history still lives only on your phone.
              </p>
            </>
          }
          aside={
            <div className="crew-aside crew-code">
              <div style={{ fontWeight: 500, fontSize: 11, letterSpacing: "0.09em", color: "var(--muted-warm)", marginBottom: 20 }}>TODAY'S CREW CODE</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 52, lineHeight: 1, letterSpacing: "0.08em", color: "var(--teal-bright)", marginBottom: 8 }}>
                POW-4417
              </div>
              <div style={{ fontSize: 14, color: "var(--muted-warm)", marginBottom: 26 }}>Expires 4:15 PM · Crystal Mountain</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 22, borderTop: "1px solid #2A2A36" }}>
                {GUARANTEES.map((g) => (
                  <div key={g} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span aria-hidden="true" style={{ color: "var(--lime)", fontWeight: 700, fontSize: 14, lineHeight: 1.5 }}>✓</span>
                    <span style={{ fontSize: 14, lineHeight: 1.5, color: "#E2E2E8" }}>{g}</span>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        <div className="crew-banner">
          <div>
            <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", color: "#2A2A2E", marginBottom: 6 }}>BETA</div>
            <p style={{ margin: 0, maxWidth: 720, fontSize: 15.5, lineHeight: 1.6, color: "#2A2A2E" }}>
              Crew is in beta and rolling out to Pro Pass holders first. Turn it on in Settings → Crew, or get on the
              list and we'll tell you when it's your turn.
            </p>
          </div>
          <a
            href={CREW_BETA_URL}
            onClick={() => trackEvent("crew_beta_click", { placement: "crew_banner" })}
            style={{
              padding: "14px 26px",
              borderRadius: 32,
              background: "var(--ink)",
              color: "#fff",
              fontFamily: "var(--font-script)",
              fontWeight: 400,
              fontSize: 20,
              whiteSpace: "nowrap",
            }}
          >
            Join the beta
          </a>
        </div>
      </div>
    </section>
  );
}
