import { SUPPORT_EMAIL } from "../config";
import { trackEvent } from "../analytics";
import logo from "../../assets/logo-trackedout.webp";

const COLUMNS = [
  {
    heading: "PRODUCT",
    links: [
      { label: "How it works", href: "#day" },
      { label: "Resorts", href: "#maps" },
      { label: "Pro Pass", href: "#metrics" },
      { label: "What's new", href: "#get" },
    ],
  },
  {
    heading: "SUPPORT",
    links: [
      { label: "Help", href: `mailto:${SUPPORT_EMAIL}?subject=Help` },
      { label: "Send feedback", href: `mailto:${SUPPORT_EMAIL}?subject=Feedback` },
      { label: "Contact", href: `mailto:${SUPPORT_EMAIL}` },
    ],
  },
  {
    heading: "LEGAL",
    // TODO(launch): the App Store listing needs a real privacy policy URL. The
    // design left these as placeholders; add /privacy and /terms routes and point
    // these at them.
    links: [
      { label: "Privacy policy", href: "#get" },
      { label: "EULA", href: "#get" },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ padding: "64px var(--gutter) 40px", background: "var(--ink)", color: "#fff" }}>
      <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
        <div className="footer-cols">
          <div style={{ flex: 1.4, minWidth: 0 }}>
            <img src={logo} alt="Tracked Out" style={{ height: 62, margin: "0 0 14px -6px", display: "block", maxWidth: "none" }} />
            <p style={{ margin: 0, maxWidth: 300, fontSize: 14, lineHeight: 1.6, color: "var(--muted-warm)" }}>
              Every turn you take, counted. Every mountain you ride, mapped. Nothing about your day leaves your phone.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "0.1em", color: "#71716C", marginBottom: 4 }}>{col.heading}</div>
              {col.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  // A mailto hands the visitor to their mail client and fires no
                  // navigation GA can see, so these are otherwise invisible.
                  // The in-page anchors above are left alone on purpose.
                  onClick={
                    l.href.startsWith("mailto:")
                      ? () => trackEvent("support_click", { topic: l.label })
                      : undefined
                  }
                  style={{ color: "#E2E2E8", fontSize: 14 }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 32,
            flexWrap: "wrap",
            marginTop: 48,
            paddingTop: 26,
            borderTop: "1px solid var(--dark-border)",
          }}
        >
          <span style={{ fontSize: 13, color: "var(--muted-warm)" }}>Built by fellow shredders in the Pacific Northwest.</span>
          <span style={{ fontSize: 12, color: "#71716C" }}>© 2020–2026 Cascade Made LLC</span>
        </div>
      </div>
    </footer>
  );
}
