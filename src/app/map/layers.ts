import type { Map as MapboxMap } from "mapbox-gl";
import { SLOPE_TILESET } from "./config";

/*
 * The Maps band's overlays, ported from MapController.swift so the two can be
 * diffed. Every function is idempotent and safe to call once on style load.
 *
 * All four sit in the `middle` slot — above land, water and terrain, below
 * roads and labels — which leaves the style's own un-slotted skiTrails-* and
 * skiLifts-* layers on top, matching how the app stacks them. `bottom` would
 * bury the satellite raster behind Standard's opaque land fill.
 *
 * Add order matters: within a slot, later layers draw higher.
 */

const SLOT = "middle";

export const LAYER = {
  satellite: "to-satellite",
  northAspect: "to-north-aspect",
  slope: "to-slope-shading",
  cliffs: "to-cliff-highlight",
} as const;

const SOURCE = {
  satellite: "to-satellite-src",
  slope: "to-slope-src",
  dem: "to-dem-src",
} as const;

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
  if (map.getLayer(LAYER.satellite)) return;
  if (!map.getSource(SOURCE.satellite)) {
    map.addSource(SOURCE.satellite, {
      type: "raster",
      url: "mapbox://mapbox.satellite",
      tileSize: 512,
      maxzoom: 22,
    });
  }
  map.addLayer({
    id: LAYER.satellite,
    type: "raster",
    source: SOURCE.satellite,
    slot: SLOT,
    layout: { visibility: "none" },
    paint: {
      "raster-opacity": 1,
      "raster-saturation": 0,
      // Keeps night lighting from dimming the imagery, as on iOS.
      "raster-brightness-min": 0,
      "raster-brightness-max": 1,
      "raster-emissive-strength": 1,
    },
  });
}

/** North-facing terrain, picked out by a hillshade lit from true north. */
function addNorthAspect(map: MapboxMap) {
  if (map.getLayer(LAYER.northAspect)) return;

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
    id: LAYER.northAspect,
    type: "hillshade",
    source: demSource,
    slot: SLOT,
    layout: { visibility: "none" },
    paint: {
      "hillshade-illumination-direction": 0,
      // iOS pins bearing to 0 because the default anchor is `viewport`.
      // Anchoring to the map means 0° is true north at any bearing, so the
      // band keeps its flyover angle without snapping the camera.
      "hillshade-illumination-anchor": "map",
      "hillshade-exaggeration": 0.65,
      "hillshade-emissive-strength": 1,
      "hillshade-highlight-color": "#A048FA", // purple700
      "hillshade-shadow-color": "#FACB2C", // orange700
    },
  });
}

function addSlopeSource(map: MapboxMap) {
  if (map.getSource(SOURCE.slope)) return;
  map.addSource(SOURCE.slope, { type: "vector", url: SLOPE_TILESET.nam.url });
}

/** The full 30°–75° slope ramp. */
function addSlopeShading(map: MapboxMap) {
  if (map.getLayer(LAYER.slope)) return;
  addSlopeSource(map);
  map.addLayer({
    id: LAYER.slope,
    type: "fill",
    source: SOURCE.slope,
    "source-layer": SLOPE_TILESET.nam.sourceLayer,
    slot: SLOT,
    layout: { visibility: "none" },
    // `interpolate` clamps below its first stop, so without this every flat
    // pixel (DN 0-29) renders washed yellow. The iOS ramp has the same gap; it
    // just never shows there because the overlay is only drawn at high zoom.
    filter: [">=", ["get", "DN"], 30],
    paint: { "fill-color": SLOPE_RAMP as never, "fill-emissive-strength": 1 },
  });
}

/**
 * Cliffs only — the steepest tail of the same data.
 *
 * Two deliberate divergences from iOS:
 *
 * 1. iOS draws slope and cliffs as one overlay whose high end it labels
 *    "Cliffs (>60°)". The band offers them as separate toggles, so two toggles
 *    with identical output would read as broken.
 *
 * 2. The threshold is 42°, not 60°. The tileset is derived from 30m ASTER DEM,
 *    which averages slope over each cell and so cannot resolve true cliff
 *    angles: tilequery sampling returns a maximum DN of 48 at both Crystal
 *    Mountain and Palisades Tahoe, with nothing at all above 50. Filtering at
 *    60 renders an empty layer. 42 picks out the genuinely steep terrain that
 *    exists in the data.
 */
const CLIFF_MIN = 42;

function addCliffHighlight(map: MapboxMap) {
  if (map.getLayer(LAYER.cliffs)) return;
  addSlopeSource(map);
  map.addLayer({
    id: LAYER.cliffs,
    type: "fill",
    source: SOURCE.slope,
    "source-layer": SLOPE_TILESET.nam.sourceLayer,
    slot: SLOT,
    layout: { visibility: "none" },
    filter: [">=", ["get", "DN"], CLIFF_MIN],
    paint: {
      // Its own ramp rather than the shared one, so the band reads red from the
      // first visible degree instead of fading in through orange.
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "DN"],
        CLIFF_MIN, "rgba(255,0,0,0.3)",
        45, "rgba(255,0,0,0.62)",
        48, "rgba(255,0,0,0.85)",
      ] as never,
      "fill-emissive-strength": 1,
    },
  });
}

/** Add every overlay once, hidden. Toggling is visibility-only from then on. */
export function addOverlays(map: MapboxMap) {
  addSatellite(map);
  addNorthAspect(map);
  addSlopeShading(map);
  addCliffHighlight(map);
}

export function setLayerVisible(map: MapboxMap, id: string, visible: boolean) {
  if (!map.getLayer(id)) return;
  map.setLayoutProperty(id, "visibility", visible ? "visible" : "none");
}
