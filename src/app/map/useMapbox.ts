import { useEffect, useRef, useState } from "react";
import type { Map as MapboxMap } from "mapbox-gl";
import { useInView } from "../hooks/useInView";
import { BASEMAP_IMPORT, HAS_MAPBOX, MAPBOX_TOKEN } from "./config";
import { loadMapbox } from "./loadMapbox";

export type MapStatus = "idle" | "loading" | "ready" | "unavailable";

export interface UseMapboxOptions {
  /** [lng, lat] */
  center: [number, number];
  zoom: number;
  pitch?: number;
  bearing?: number;
  minZoom?: number;
  maxZoom?: number;
  /** Mapbox Standard day/night. */
  lightPreset?: "dawn" | "day" | "dusk" | "night";
}

/**
 * Creates a GL JS map when its container nears the viewport, and tears it down
 * on unmount.
 *
 * Deferred on purpose: each `new mapboxgl.Map()` is a billed map load, so a
 * visitor who never scrolls this far should cost nothing. `useInView` latches,
 * so scrolling away and back does not charge twice.
 *
 * `map` is non-null only once the style has loaded, which means callers can add
 * sources and layers in an effect keyed on `[map]` without guarding on
 * `isStyleLoaded()`.
 *
 * Options are read once, at init. Everything dynamic — pitch, layer visibility
 * — is driven imperatively through the returned map, so a fresh object literal
 * on each render can never retrigger initialisation.
 */
export function useMapbox(options: UseMapboxOptions) {
  const [hostRef, inView] = useInView<HTMLDivElement>();
  const [map, setMap] = useState<MapboxMap | null>(null);
  const [status, setStatus] = useState<MapStatus>(HAS_MAPBOX ? "idle" : "unavailable");

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!HAS_MAPBOX || !inView) return;

    const host = hostRef.current;
    if (!host) return;

    let instance: MapboxMap | null = null;
    let cancelled = false;
    setStatus("loading");

    loadMapbox()
      .then((gl) => {
        if (cancelled) return;
        const o = optionsRef.current;

        instance = new gl.Map({
          container: host,
          style: "mapbox://styles/wemps/cmjhzpd1t005p01sp0we35brl",
          accessToken: MAPBOX_TOKEN,
          center: o.center,
          zoom: o.zoom,
          pitch: o.pitch ?? 0,
          bearing: o.bearing ?? 0,
          minZoom: o.minZoom,
          maxZoom: o.maxZoom,
          // Supplying the style fragment's config at construction avoids the
          // "Style import not found" race that setConfigProperty hits when
          // called too early.
          config: { [BASEMAP_IMPORT]: { lightPreset: o.lightPreset ?? "day" } },
          // Toggles only — nothing here should ever capture a scroll.
          interactive: false,
          scrollZoom: false,
          dragPan: false,
          dragRotate: false,
          touchZoomRotate: false,
          touchPitch: false,
          doubleClickZoom: false,
          keyboard: false,
          boxZoom: false,
          // Attribution is added explicitly so it can be positioned and styled;
          // it is never removed. See components.css.
          attributionControl: false,
          performanceMetricsCollection: false,
          antialias: false,
        });

        instance.on("error", (event) => {
          const status = (event.error as { status?: number } | undefined)?.status;
          if (status === 401 || status === 403) {
            // A bad token would otherwise retry forever; fail to the fallback.
            setStatus("unavailable");
            instance?.remove();
            instance = null;
          }
        });

        instance.on("style.load", () => {
          if (cancelled || !instance) return;
          instance.addControl(new gl.AttributionControl({ compact: false }), "bottom-right");
          setMap(instance);
          setStatus("ready");
        });
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      });

    return () => {
      cancelled = true;
      setMap(null);
      instance?.remove();
    };
  }, [inView, hostRef]);

  return { hostRef, map, status };
}
