import { useEffect } from "react";

const DEFAULT_TITLE = "Tracked Out — Ski & Snowboard Tracking";
const DEFAULT_DESCRIPTION =
  "Turn on tracking at the first chair and forget about it. Vertical, speed, turn counts and a map of every lap — plus a read on where you're losing time.";

function setMeta(selector: string, content: string) {
  document.head.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
}

interface PageMeta {
  title?: string;
  description?: string;
  /** JSON-LD structured data injected while the page is mounted. */
  jsonLd?: object;
}

/**
 * Client-side SEO for the GitHub Pages SPA: keeps <title>, description and the
 * OG/Twitter tags in sync per route, and restores the defaults on unmount.
 */
export function usePageMeta({ title, description, jsonLd }: PageMeta = {}) {
  // Stringify so an inline object literal doesn't re-run the effect every render.
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : undefined;

  useEffect(() => {
    const fullTitle = title ? `${title} — Tracked Out` : DEFAULT_TITLE;
    const desc = description ?? DEFAULT_DESCRIPTION;

    document.title = fullTitle;
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', desc);

    let script: HTMLScriptElement | null = null;
    if (jsonLdString) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = jsonLdString;
      document.head.appendChild(script);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]', DEFAULT_DESCRIPTION);
      setMeta('meta[property="og:title"]', DEFAULT_TITLE);
      setMeta('meta[property="og:description"]', DEFAULT_DESCRIPTION);
      setMeta('meta[name="twitter:title"]', DEFAULT_TITLE);
      setMeta('meta[name="twitter:description"]', DEFAULT_DESCRIPTION);
      script?.remove();
    };
  }, [title, description, jsonLdString]);
}
