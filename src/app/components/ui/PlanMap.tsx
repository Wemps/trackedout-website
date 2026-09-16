import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";

/** Palisades Tahoe. */
const CENTER: [number, number] = [39.1969, -120.2356];

/*
 * The design specifies CARTO's `dark_all` basemap. That endpoint now stamps every
 * tile served without an API key with an "API KEY REQUIRED" watermark, so tiles
 * are only requested when a key is configured — otherwise we render the styled
 * panel on its own, which reads as intentional rather than broken.
 *
 * Set VITE_CARTO_API_KEY (see .env.example) to turn the real map on.
 */
const CARTO_KEY = import.meta.env.VITE_CARTO_API_KEY;
const TILE_URL = `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png${
  CARTO_KEY ? `?api_key=${CARTO_KEY}` : ""
}`;

/**
 * The non-interactive trail map behind demo chapter one.
 *
 * Leaflet is imported dynamically so it lands in its own chunk rather than the
 * main bundle — it's a decorative map on a marketing page, not a feature. Every
 * interaction handler is off: this is a picture that happens to be tiles.
 */
export function PlanMap() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [tilesOn] = useState(Boolean(CARTO_KEY));

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !tilesOn) return;

    let map: LeafletMap | null = null;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    (async () => {
      const [L] = await Promise.all([import("leaflet"), import("leaflet/dist/leaflet.css")]);
      if (cancelled || !hostRef.current) return;

      map = L.map(host, {
        center: CENTER,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        keyboard: false,
      });

      L.tileLayer(TILE_URL, { maxZoom: 18 }).addTo(map);
      L.circleMarker(CENTER, {
        radius: 9,
        color: "#0C0C14",
        weight: 3,
        fillColor: "#43EDEA",
        fillOpacity: 1,
      }).addTo(map);

      // The panel animates in, so the container's final size settles a beat late.
      timer = setTimeout(() => map?.invalidateSize(), 60);
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      map?.remove();
    };
  }, [tilesOn]);

  return (
    <div
      className="demo-aside demo-map"
      style={{
        width: 360,
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid var(--hairline)",
        background: "var(--ink-deep)",
        position: "relative",
      }}
    >
      <div
        ref={hostRef}
        style={{ width: "100%", height: 340, position: "relative" }}
        role="img"
        aria-label="Trail map of Palisades Tahoe"
      >
        {!tilesOn && (
          // Keyless fallback: the contour wash and marker, minus the basemap.
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 52% 46%, rgba(67,237,234,.12), rgba(12,12,20,0) 62%), " +
                "repeating-linear-gradient(122deg, rgba(255,255,255,.035) 0 1px, transparent 1px 14px)",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 18,
                height: 18,
                marginLeft: -9,
                marginTop: -9,
                borderRadius: "50%",
                background: "var(--teal-bright)",
                border: "3px solid var(--ink-deep)",
              }}
            />
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: 14,
          top: 14,
          zIndex: 500,
          padding: "9px 13px",
          borderRadius: 14,
          background: "rgba(12,12,20,.82)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,.14)",
        }}
      >
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "#fff" }}>Palisades Tahoe</div>
        <div style={{ marginTop: 2, fontSize: 11, color: "var(--lime)" }}>Bluebird · 14″ in 72h · 24°F</div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 14,
          bottom: 14,
          zIndex: 500,
          padding: "7px 12px",
          borderRadius: 32,
          background: "rgba(12,12,20,.82)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,.14)",
          fontWeight: 600,
          fontSize: 10.5,
          letterSpacing: "0.08em",
          color: "var(--teal-bright)",
        }}
      >
        MAP SAVED OFFLINE
      </div>
    </div>
  );
}
