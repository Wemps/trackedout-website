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
  /**
   * Maps band, full-bleed. Crystal Mountain, tilted into a flyover.
   *
   * Bearing 247.5 is the true bearing from this centre to the summit of Mount
   * Rainier, 22.4km away, so the volcano sits dead ahead on the horizon. It
   * also keeps the camera east of the mountain looking back at it, which is
   * the side Crystal's south- and east-facing terrain is on.
   *
   * Pitch 79 rather than 60 is what actually brings Rainier into frame: the
   * extra tilt trades foreground for horizon. At this pitch the style's default
   * atmosphere whites the distance out completely, so the band also relaxes the
   * fog (see ATMOSPHERE below) — without that, the whole frame renders empty.
   */
  band: { center: [-121.488, 46.93] as [number, number], zoom: 13.75, bearing: 247.5, pitch: 79 },
} as const;

/**
 * Fog for the band.
 *
 * Mapbox Standard's default atmosphere is tuned for a moderate pitch; at 79 it
 * erases everything past the foreground, which is exactly the distance we are
 * tilting up to show. Pushing the range out and flattening the horizon blend
 * keeps Rainier, 22km away, legible on the skyline.
 */
export const ATMOSPHERE = {
  range: [1, 18] as [number, number],
  "horizon-blend": 0.03,
  color: "#dfe8f0",
  "high-color": "#9fc4e8",
  "space-color": "#0c0c14",
  "star-intensity": 0,
};

/**
 * The run called out by the band's detail card, highlighted on the map so the
 * card and the terrain point at the same thing. The id is the feature id in the
 * `wemps.runs` tileset, read via tilequery.
 */
export const HIGHLIGHT_RUN = {
  id: "c8d0e36bbc9cbe460600f2bcc96a8faab7eb2fff",
  name: "Bear Pits",
  /**
   * A point on the run, [lng, lat], used to pin the detail card beside it.
   *
   * Fixed rather than derived from `queryRenderedFeatures`: that only returns
   * features the map has actually painted, so it yields nothing before tiles
   * land — and nothing at all in a background tab, where WebGL is paused.
   * Projecting a known coordinate is pure maths and always works.
   */
  at: [-121.49183, 46.92828] as [number, number],
} as const;

/** Slope tilesets. Only North America ships — every camera is a US resort. */
export const SLOPE_TILESET = {
  nam: { url: "mapbox://wemps.slopes_tileset-nam", sourceLayer: "slopenam4326" },
  /** Kept for when a European resort appears on the page. */
  euro: { url: "mapbox://wemps.slopes_tileset-euro", sourceLayer: "slopeeuro4326" },
} as const;

/** Slope tiles are minzoom 13 — below this the overlays silently disappear. */
export const SLOPE_MIN_ZOOM = 13;
