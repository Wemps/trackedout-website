/*
 * GA4 measurement ID. Not a secret: it ships in the page source of every site
 * running GA, and it names the property rather than granting access to it. It
 * is committed rather than left to an Actions secret so analytics cannot go
 * missing from a deploy because nobody set one — VITE_GA_MEASUREMENT_ID still
 * overrides it when a build needs to report somewhere else.
 */
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-7EVYZ9X3CR";

/*
 * Dev traffic would land in the same property as real visitors, so `npm run
 * dev` stays silent. Setting VITE_GA_MEASUREMENT_ID in .env turns it back on,
 * which is how you verify tagging locally without shipping a build.
 */
const ENABLED =
  Boolean(GA_ID) && (import.meta.env.PROD || Boolean(import.meta.env.VITE_GA_MEASUREMENT_ID));

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function initAnalytics() {
  if (!ENABLED) return;

  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(gtagScript);

  const inlineScript = document.createElement("script");
  // send_page_view:false so SPA route changes are the sole source of page_view,
  // avoiding a double count on first load.
  inlineScript.textContent = [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    "gtag('js', new Date());",
    `gtag('config', '${GA_ID}', { send_page_view: false });`,
  ].join("\n");
  document.head.appendChild(inlineScript);
}

/** Fire a page_view for the current SPA route. Call on every route change. */
export function trackPageView(path: string) {
  if (!ENABLED) return;
  // Defer a frame so usePageMeta has updated document.title first — otherwise
  // page_title lags one navigation behind.
  requestAnimationFrame(() => {
    window.gtag?.("event", "page_view", {
      page_path: path,
      page_location: window.location.origin + path,
      page_title: document.title,
    });
  });
}

/*
 * Conversion-worthy actions this marketing site can observe.
 *
 * Two kinds. `app_store_click` and `crew_beta_click` are the conversions. The
 * rest are engagement: they answer whether anyone actually works the two
 * interactive pieces of the page before deciding, which is the only read we
 * get on whether those pieces earn their build cost.
 *
 * Deliberately not tracked: nav and in-page anchor links. They would outnumber
 * everything here and say little that scroll depth doesn't.
 */
type TrackedEvent =
  | "app_store_click"
  | "crew_beta_click"
  | "map_layer_toggle"
  | "demo_chapter_select"
  | "support_click";

export function trackEvent(event: TrackedEvent, params?: Record<string, unknown>) {
  window.gtag?.("event", event, params);
}
