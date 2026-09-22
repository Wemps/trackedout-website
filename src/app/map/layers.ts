import type { Map as MapboxMap } from "mapbox-gl";
import { SLOPE_TILESET } from "./config";

/*
 * The Maps band's overlays, ported from MapController.swift so the two can be
 * diffed.
 *
 * All three sit in the `middle` slot — above land, water and terrain, below
 * roads and labels — which leaves the style's own un-slotted skiTrails-* and
 * skiLifts-* layers on top, matching how the app stacks them. `bottom` would
 * bury the satellite raster behind Standard's opaque land fill.
 *
 * Exactly one overlay is visible at a time, cross-faded over FADE_MS. Each
 * starts hidden so its tiles are only fetched once it is actually chosen.
 */

const SLOT = "middle";

/** Cross-fade duration. Also the delay before a faded-out layer is hidden. */
export const FADE_MS = 500;

export type OverlayKey = "satellite" | "slope" | "north";

const LAYER_ID = {
  satellite: "to-satellite",
  slope: "to-slope-shading",
  north: "to-north-aspect",
} as const;

const SOURCE = {
  satellite: "to-satellite-src",
  slope: "to-slope-src",
  dem: "to-dem-src",
} as const;

/**
 * The paint property each overlay fades on, and its lit value.
 *
 * Hillshade has no opacity property, so it fades on exaggeration instead: at 0
 * every slope reads as flat and the layer renders nothing.
 */
const FADE = {
  satellite: { prop: "raster-opacity", lit: 1 },
  slope: { prop: "fill-opacity", lit: 1 },
  north: { prop: "hillshade-exaggeration", lit: 0.65 },
} as const satisfies Record<OverlayKey, { prop: string; lit: number }>;

/** The iOS slope ramp, verbatim (UIColor.orange is rgb(255,128,0)). */
const SLOPE_RAMP: unknown[] = [
  "interpolate",
  ["linear"],
  ["get", "DN"],
  30, "rgba(255,255,0,0.25)",
  35, "rgba(255,255,0,0.35)",
  40, "rgba(255,128,0,0.45)",
  45, "rgba(255,128,0,0.5)",
  50, "rgba(255,0,0,0.7)",
  55, "rgba(255,0,0,0.75)",
  60, "rgba(255,0,0,0.8)",
  65, "rgba(255,0,0,0.85)",
  75, "rgba(255,0,0,0.9)",
];

/** Satellite imagery, as a raster layer under the trails — not a style swap. */
function addSatellite(map: MapboxMap) {
  if (map.getLayer(LAYER_ID.satellite)) return;
  if (!map.getSource(SOURCE.satellite)) {
    map.addSource(SOURCE.satellite, {
      type: "raster",
      url: "mapbox://mapbox.satellite",
      tileSize: 512,
      maxzoom: 22,
    });
  }
  map.addLayer({
    id: LAYER_ID.satellite,
    type: "raster",
    source: SOURCE.satellite,
    slot: SLOT,
    layout: { visibility: "none" },
    paint: {
      "raster-opacity": 0,
      "raster-opacity-transition": { duration: FADE_MS },
      "raster-saturation": 0,
      // Keeps night lighting from dimming the imagery, as on iOS.
      "raster-brightness-min": 0,
      "raster-brightness-max": 1,
      "raster-emissive-strength": 1,
    } as never,
  });
}

/** North-facing terrain, picked out by a hillshade lit from true north. */
function addNorthAspect(map: MapboxMap) {
  if (map.getLayer(LAYER_ID.north)) return;

  // The style already declares a terrain-DEM source; reuse it rather than
  // fetching byte-identical tiles twice.
  let demSource = "mapbox-dem";
  if (!map.getSource(demSource)) {
    demSource = SOURCE.dem;
    if (!map.getSource(demSource)) {
      map.addSource(demSource, { type: "raster-dem", url: "mapbox://mapbox.mapbox-terrain-dem-v1" });
    }
  }

  map.addLayer({
    id: LAYER_ID.north,
    type: "hillshade",
    source: demSource,
    slot: SLOT,
    layout: { visibility: "none" },
    paint: {
      // Lit from due south — where the sun actually is in the northern
      // hemisphere. iOS lights from 0 (due north), which inverts the read:
      // "shadow" then lands on the sunny faces. At 180 the shadow colour falls
      // on north-facing terrain, so the layer says what the caption says it
      // does — the snow that survived the sun.
      "hillshade-illumination-direction": 180,
      // iOS pins bearing to 0 because the default anchor is `viewport`.
      // Anchoring to the map makes the direction a true compass bearing at any
      // camera angle, so the band keeps its flyover without snapping north.
      "hillshade-illumination-anchor": "map",
      "hillshade-exaggeration": 0,
      "hillshade-exaggeration-transition": { duration: FADE_MS },
      "hillshade-emissive-strength": 1,
      // Swapped relative to iOS, which pairs purple700 with `highlight`.
      // Combined with the southern light above: gold marks the faces taking
      // sun, purple marks the shaded north-facing terrain that holds snow.
      "hillshade-highlight-color": "#FACB2C", // orange700 — sunny faces
      "hillshade-shadow-color": "#A048FA", // purple700 — shaded, north-facing
    } as never,
  });
}

/** The 30°–75° slope ramp. */
function addSlopeShading(map: MapboxMap) {
  if (map.getLayer(LAYER_ID.slope)) return;
  if (!map.getSource(SOURCE.slope)) {
    map.addSource(SOURCE.slope, { type: "vector", url: SLOPE_TILESET.nam.url });
  }
  map.addLayer({
    id: LAYER_ID.slope,
    type: "fill",
    source: SOURCE.slope,
    "source-layer": SLOPE_TILESET.nam.sourceLayer,
    slot: SLOT,
    layout: { visibility: "none" },
    // `interpolate` clamps below its first stop, so without this every flat
    // pixel (DN 0-29) renders washed yellow. The iOS ramp has the same gap; it
    // just never shows there because the overlay is only drawn at high zoom.
    filter: [">=", ["get", "DN"], 30],
    paint: {
      "fill-color": SLOPE_RAMP as never,
      "fill-opacity": 0,
      "fill-opacity-transition": { duration: FADE_MS },
      "fill-emissive-strength": 1,
    } as never,
  });
}

/** Add every overlay once, hidden and fully faded out. */
export function addOverlays(map: MapboxMap) {
  addSatellite(map);
  addNorthAspect(map);
  addSlopeShading(map);
}

/**
 * Cross-fade to a single overlay, or to none. Returns a cleanup that cancels
 * any fade still in flight.
 *
 * Fading in has to happen a frame after the layer becomes visible: Mapbox
 * applies a paint change made in the same frame as the visibility change
 * instantly, with no transition. Fading out defers `visibility: none` until the
 * fade has finished, so the layer is still painted while it dims.
 *
 * Both of those are deferred callbacks, which means they can outlive the map.
 * Once `map.remove()` has run, `map.style` is undefined and every style method
 * throws from inside — `map.getLayer?.(id)` does not help, because the method
 * exists and it is the style underneath that is gone. So callers must call the
 * returned cleanup, and each callback re-checks liveness before touching the
 * map.
 */
export function showOverlay(map: MapboxMap, active: OverlayKey | null) {
  const timers: number[] = [];
  let cancelled = false;

  // `loaded()` throws on a removed map for the same reason, hence the try.
  const alive = () => {
    if (cancelled) return false;
    try {
      return Boolean(map.getStyle());
    } catch {
      return false;
    }
  };

  for (const key of Object.keys(FADE) as OverlayKey[]) {
    const { prop, lit } = FADE[key];
    const id = LAYER_ID[key];
    if (!alive() || !map.getLayer(id)) continue;

    if (key === active) {
      map.setLayoutProperty(id, "visibility", "visible");
      requestAnimationFrame(() => {
        if (!alive() || !map.getLayer(id)) return;
        map.setPaintProperty(id, prop, lit);
      });
    } else {
      map.setPaintProperty(id, prop, 0);
      timers.push(
        window.setTimeout(() => {
          if (!alive() || !map.getLayer(id)) return;
          // Skip if it has been re-selected while fading out.
          if (map.getPaintProperty(id, prop) !== 0) return;
          map.setLayoutProperty(id, "visibility", "none");
        }, FADE_MS),
      );
    }
  }

  return () => {
    cancelled = true;
    for (const t of timers) window.clearTimeout(t);
  };
}
