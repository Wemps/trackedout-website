/*
 * The rating and quotes are placeholder copy from the mock — HANDOFF.md § Placeholders
 * flags them as invented. Replace with real App Store reviews before launch.
 */
const REVIEWS = [
  {
    title: "This totally rips!",
    quote: "Best way I've found to remember the best paths down the hill. Super accurate and EASY TO USE.",
    author: "Elroy J Shredder",
  },
  {
    title: "Pro pass user here",
    quote: "Blown away by the ski metrics and map detail — felt like the dev was giving away too much in the free version.",
    author: "Brittsnoel",
  },
  {
    title: "More like Tracked Fun!",
    quote: "I used to get lost with no idea how many runs I'd taken. With Tracked Out, I stay on track!",
    author: "PowderSnortingElk",
  },
];

export function Reviews() {
  return (
    <section style={{ padding: "96px var(--gutter)", background: "#fff", borderTop: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 36 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 62, lineHeight: 1 }}>4.8</span>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "0.08em", color: "var(--muted-grey)" }}>ON THE APP STORE</span>
        </div>

        <div className="review-grid">
          {REVIEWS.map((r) => (
            <figure key={r.title} style={{ margin: 0, padding: 28, border: "1px solid var(--hairline)", borderRadius: 20 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, lineHeight: 1.3, marginBottom: 12 }}>{r.title}</div>
              <blockquote style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.6, color: "var(--body-grey)" }}>{r.quote}</blockquote>
              <figcaption style={{ fontWeight: 500, fontSize: 12, color: "var(--muted-grey)" }}>{r.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
