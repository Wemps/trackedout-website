/*
 * Mapbox configuration — styles, cameras and the token.
 *
 * COORDINATE ORDER: Mapbox is [lng, lat]. The Leaflet code this replaced was
 * [lat, lng]. Everything in this file and anything consuming it is [lng, lat].
 *
 * Two rendering paths, because one is forced on us:
 *
 *  - The app's live style, TrackedOut-Standard-v4, imports Mapbox Standard. The
 *    Static Images API refuses any style that imports Standard ("Custom styles
 *    that import either of these styles are not supported" — it returns 422), so
 *    that style can only be rendered by GL JS. It is used for the Maps band,
 *    which is the one map that earns the cost by having working layer toggles.
 *
 *  - The two decorative maps use the pre-Standard basic styles, which import
 *    nothing and therefore do render as static images: one `<img>`, no JS, and
 *    a request billed at a fifth of a GL JS map load.
 */

/**
 * Public Mapbox token. NOT a secret: Vite inlines every `VITE_*` variable into
 * the built JS, which is served publicly. Keeping it in an Actions secret keeps
 * it out of the repo, not out of the bundle — which is normal and correct for a
 * `pk.*` token. Spend is protected by URL restrictions and a limit set in the
 * Mapbox account, not by hiding this string.
 */
export const MAPBOX_TOKEN: string = import.meta.env.VITE_MAPBOX_TOKEN ?? "";
export const HAS_MAPBOX = Boolean(MAPBOX_TOKEN);

/**
 * Styles.
 *
 * WARNING: the two `*_BASIC` styles were dropped from the iOS app in commit
 * be4560d7 when four styles were collapsed into one Standard-based style with a
 * day/night `lightPreset`. They still exist in the Mapbox account and this site
 * now depends on them. Do not delete them from Mapbox Studio without replacing
 * the references here first.
 */
export const STYLE = {
  /** Live app style. GL JS only — imports Standard, so no static rendering. */
  standard: "mapbox://styles/wemps/cmjhzpd1t005p01sp0we35brl",
  /** Pre-Standard dark basic. Static-renderable. */
  dark: "wemps/cm6hhpx80000201rbcray65qv",
  /** Pre-Standard light basic. Static-renderable. */
  light: "wemps/cm6hhjtxj000101rbb51d72os",
  /** Static-renderable satellite. Unused, kept as the documented fallback. */
  satellite: "wemps/cm6hinjov000301rb82njcn9p",
} as const;

/** The import id of the Mapbox Standard fragment inside the standard style. */
export const BASEMAP_IMPORT = "basemap";

/**
 * Per-map cameras. [lng, lat].
 *
 * Centres are the visual middle of each ski area, not the town or the base
 * lodge, so the trail network fills the frame.
 *
 * Zooms are tuned per box size. The Static Images API's `@2x` doubles pixel
 * density without widening coverage, so a `560x360@2x` request shows the same
 * ground as `560x360` — half the linear extent of the `1120x720` renders these
 * were eyeballed against. Hence the lower-than-expected numbers.
 */
export const CAMERA = {
  /** Demo panel, 360x340. Palisades Tahoe, as specified in design/HANDOFF.md. */
  demo: { center: [-120.248, 39.193] as [number, number], zoom: 12.3 },
  /** Crew map, 560x360. Crystal Mountain — matches the day-pass card's copy. */
  crew: { center: [-121.488, 46.93] as [number, number], zoom: 12 },
  /** Maps band, full-bleed. Crystal Mountain, tilted into a flyover. */
  band: { center: [-121.488, 46.93] as [number, number], zoom: 13.2, bearing: 20, pitch: 60 },
} as const;

/** Slope tilesets. Only North America ships — every camera is a US resort. */
export const SLOPE_TILESET = {
  nam: { url: "mapbox://wemps.slopes_tileset-nam", sourceLayer: "slopenam4326" },
  /** Kept for when a European resort appears on the page. */
  euro: { url: "mapbox://wemps.slopes_tileset-euro", sourceLayer: "slopeeuro4326" },
} as const;

/** Slope tiles are minzoom 13 — below this the overlays silently disappear. */
export const SLOPE_MIN_ZOOM = 13;
