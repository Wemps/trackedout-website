/*
 * The App Store listing. Every download button on the page routes through
 * `appStoreURL`, so this is the single place that changes.
 */
const APP_STORE_BASE =
  "https://apps.apple.com/us/app/tracked-out-ski-snowboard/id1541573890";

/** Apple provider ID, from App Store Connect → Analytics → Acquisition → Campaigns. */
const PROVIDER_TOKEN = "";

/**
 * Apple campaign token (`ct`) for a placement. Page-granular on purpose: Apple
 * suppresses any campaign with fewer than five first-time downloads, so splitting
 * one page across many tokens risks every bucket reporting nothing. Element-level
 * detail lives in the GA4 `placement` param instead.
 */
export function appStoreURL(campaignToken = "webLanding") {
  const params = new URLSearchParams();
  if (PROVIDER_TOKEN) params.set("pt", PROVIDER_TOKEN);
  // Apple caps `ct` at 30 alphanumeric characters and spaces.
  params.set("ct", campaignToken.slice(0, 30));
  params.set("mt", "8");
  return `${APP_STORE_BASE}?${params.toString()}`;
}

/** Beta signup for the Crew feature set. */
export const CREW_BETA_URL = "mailto:crew@trackedout.app?subject=Crew%20beta";
export const SUPPORT_EMAIL = "support@trackedout.app";
