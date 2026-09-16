const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function initAnalytics() {
  if (!GA_ID) return;

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
  if (!GA_ID) return;
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

/** Conversion-worthy actions this marketing site can observe. */
type TrackedEvent = "app_store_click" | "crew_beta_click";

export function trackEvent(event: TrackedEvent, params?: Record<string, unknown>) {
  window.gtag?.("event", event, params);
}
