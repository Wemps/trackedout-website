/*
 * PLACEHOLDER COPY — the 4.8 and all three quotes are invented for the mock
 * (design/HANDOFF.md § Placeholders). Replace with real App Store reviews
 * before launch. Deliberately not published as `aggregateRating` structured
 * data while that is still true; see Landing.tsx.
 */
const PULL = {
  quote: "Blown away by the ski metrics and map detail. Felt like the dev was giving away too much in the free version.",
  author: "Brittsnoel · Pro Pass",
};

const SUPPORTING = [
  {
    quote: "Best way I've found to remember the best paths down the hill. Super accurate and easy to use.",
    author: "Elroy J Shredder",
  },
  {
    quote: "I used to get lost with no idea how many runs I'd taken. With Tracked Out, I stay on track.",
    author: "PowderSnortingElk",
  },
];

function Stars() {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 10 }} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={16} height={16} viewBox="0 0 24 24" fill="var(--lime)">
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Social proof, as a dark band.
 *
 * It sits between the white Crew section and the brand-gradient download band,
 * which otherwise run straight from white into yellow; the ink here gives the
 * page a beat of dark before the finish. One quote carries the argument at
 * display size and two support it, rather than three equal cards.
 */
export function Reviews() {
  return (
    <section style={{ padding: "96px var(--gutter)", background: "var(--ink)", color: "#fff" }}>
      <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
        <div className="reviews-row">
          <div className="reviews-score">
            <Stars />
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 86,
                lineHeight: 0.9,
                color: "var(--teal-bright)",
              }}
            >
              4.8
            </div>
            <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "0.1em", color: "var(--muted-warm)", marginTop: 10 }}>
              ON THE APP STORE
            </div>
            <p style={{ margin: "18px 0 0", fontSize: 13.5, lineHeight: 1.7, color: "var(--muted-warm)" }}>
              From skiers and riders who track every day they get.
            </p>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <figure style={{ margin: 0 }}>
              <blockquote
                className="reviews-pull"
                style={{
                  margin: "0 0 12px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 34,
                  lineHeight: 1.25,
                }}
              >
                "{PULL.quote}"
              </blockquote>
              <figcaption style={{ fontWeight: 500, fontSize: 11.5, color: "var(--muted-warm)" }}>{PULL.author}</figcaption>
            </figure>

            <div className="reviews-small">
              {SUPPORTING.map((r) => (
                <figure key={r.author} style={{ margin: 0 }}>
                  <blockquote style={{ margin: "0 0 10px", fontSize: 14.5, lineHeight: 1.6, color: "#E2E2E8" }}>
                    "{r.quote}"
                  </blockquote>
                  <figcaption style={{ fontWeight: 500, fontSize: 11.5, color: "var(--muted-warm)" }}>{r.author}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
