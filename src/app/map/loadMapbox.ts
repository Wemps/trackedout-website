import type mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN } from "./config";

let pending: Promise<typeof mapboxgl> | null = null;

/**
 * Load GL JS once, no matter how many maps ask for it.
 *
 * Vite already emits one shared chunk from the module graph; the memoised
 * promise dedupes the *runtime* side — parsing, assigning the token, injecting
 * the stylesheet — when several callers race. The dynamic import is what keeps
 * ~230KB gzipped out of the main bundle until a map is actually needed.
 */
export function loadMapbox() {
  pending ??= Promise.all([import("mapbox-gl"), import("mapbox-gl/dist/mapbox-gl.css")]).then(([mod]) => {
    const gl = mod.default;
    gl.accessToken = MAPBOX_TOKEN;
    return gl;
  });
  return pending;
}
