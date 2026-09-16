const PASSES = ["EPIC", "IKON", "MOUNTAIN COLLECTIVE", "INDY PASS", "+ 4,000 LOCAL HILLS"];

export function PassBand() {
  return (
    <section style={{ borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)", background: "#fff" }}>
      <div
        className="pass-band"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "var(--content-max)",
          margin: "0 auto",
          padding: "22px var(--gutter)",
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: "0.1em",
          color: "var(--muted-grey)",
        }}
      >
        {PASSES.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </div>
    </section>
  );
}
