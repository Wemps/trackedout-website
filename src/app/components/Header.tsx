import { useEffect, useRef, useState } from "react";
import { useScrolledPast, smoothstep } from "../hooks/useScrollY";
import { trackEvent } from "../analytics";
import logoFull from "../../assets/logo-trackedout.webp";
import logoWord from "../../assets/logo-wordmark.webp";

const NAV = [
  { href: "#day", label: "How it works" },
  { href: "#metrics", label: "Metrics" },
  { href: "#sensei", label: "Ski Sensei" },
  { href: "#maps", label: "Resorts" },
  { href: "#crew", label: "Crew" },
];

/** Scroll distance over which the logo settles from oversized mark to wordmark. */
const RANGE = 220;
const MAX_SCALE = 1.4;
const MIN_SCALE = 0.55;

/*
 * Below this width the morph is switched off entirely. It exists so the oversized
 * mark can overhang a full-width bar and then tuck itself away; on a phone there is
 * no room to overhang into, and at 1.4x the mark covers the hero headline.
 */
const MORPH_MIN_WIDTH = 901;
const COMPACT_SCALE = 0.36;

export function Header() {
  const glass = useScrolledPast(8);
  const fullRef = useRef<HTMLImageElement>(null);
  const wordRef = useRef<HTMLImageElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /*
   * The logo crossfade runs every frame, so it writes to the nodes directly
   * instead of going through state. At rest the oversized mark overhangs the bar;
   * scrolled, the wordmark sits centred in it. The bar height never changes.
   */
  useEffect(() => {
    let queued = false;

    const apply = () => {
      queued = false;
      const compact = window.innerWidth < MORPH_MIN_WIDTH;
      const e = compact ? 0 : smoothstep(window.scrollY / RANGE);
      const scale = compact ? COMPACT_SCALE : MAX_SCALE - (MAX_SCALE - MIN_SCALE) * e;
      const transform = `translateY(${(compact ? 0 : -12 * e).toFixed(2)}px) scale(${scale.toFixed(3)})`;

      if (fullRef.current) {
        fullRef.current.style.transform = transform;
        fullRef.current.style.opacity = (1 - e).toFixed(3);
      }
      if (wordRef.current) {
        wordRef.current.style.transform = transform;
        wordRef.current.style.opacity = e.toFixed(3);
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const imgStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    height: 120,
    transformOrigin: "top left",
    willChange: "transform, opacity",
    display: "block",
    maxWidth: "none",
  } as const;

  return (
    <header className={`site-header ${glass ? "site-header--glass" : ""}`} style={{ padding: "16px var(--gutter)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "var(--content-max)",
          margin: "0 auto",
        }}
      >
        <a href="#top" aria-label="Tracked Out — home" style={{ position: "relative", display: "block", width: 82, height: 52 }}>
          <img ref={fullRef} src={logoFull} alt="Tracked Out" style={imgStyle} />
          <img ref={wordRef} src={logoWord} alt="" aria-hidden="true" style={{ ...imgStyle, opacity: 0 }} />
        </a>

        <nav className="site-nav" style={{ display: "flex", alignItems: "center", gap: 30, fontWeight: 500, fontSize: 14, color: "#3A3A3E" }}>
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a
            href="#get"
            onClick={() => trackEvent("app_store_click", { placement: "header" })}
            style={{
              padding: "9px 18px",
              borderRadius: 32,
              background: "var(--ink)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Get the app
          </a>
        </nav>

        {/* Below 900px the nav collapses — the design stopped at desktop, see design/HANDOFF.md. */}
        <button
          type="button"
          className="site-nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" className="mobile-nav">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <a
            href="#get"
            onClick={() => {
              setMenuOpen(false);
              trackEvent("app_store_click", { placement: "header_mobile" });
            }}
            className="mobile-nav__cta"
          >
            Get the app
          </a>
        </nav>
      )}
    </header>
  );
}
