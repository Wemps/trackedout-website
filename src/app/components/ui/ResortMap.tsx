import { useEffect, useState } from "react";
import { CAMERA, SLOPE_MIN_ZOOM } from "../../map/config";
import { useMapbox } from "../../map/useMapbox";
import { addOverlays, LAYER, setLayerVisible } from "../../map/layers";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type LayerKey = "terrain" | "satellite" | "slope" | "north" | "cliffs";

const TOGGLES: { key: LayerKey; label: string }[] = [
  { key: "terrain", label: "3D terrain" },
  { key: "satellite", label: "Satellite" },
  { key: "slope", label: "Slope shading" },
  { key: "north", label: "North aspect" },
  { key: "cliffs", label: "Cliff highlighting" },
];

/** Which map layer each toggle drives. `terrain` is camera pitch, not a layer. */
const LAYER_FOR: Partial<Record<LayerKey, string>> = {
  satellite: LAYER.satellite,
  slope: LAYER.slope,
  north: LAYER.northAspect,
  cliffs: LAYER.cliffs,
};

/**
 * The Maps section's full-bleed band — the one live map on the page.
 *
 * It earns GL JS because its five layer toggles are the section's whole point:
 * they demonstrate the same overlays the app ships. The other two maps on the
 * page are static images.
 */
export function ResortMap() {
  const reduced = useReducedMotion();
  const { hostRef, map, status } = useMapbox({
    center: CAMERA.band.center,
    zoom: CAMERA.band.zoom,
    pitch: CAMERA.band.pitch,
    bearing: CAMERA.band.bearing,
    // Slope tiles are minzoom 13; below it the overlays silently vanish.
    minZoom: SLOPE_MIN_ZOOM,
  });

  const [on, setOn] = useState<Record<LayerKey, boolean>>({
    terrain: true,
    satellite: false,
    slope: false,
    north: false,
    cliffs: false,
  });

  // Add every overlay once, hidden; toggling is visibility-only from here on,
  // which avoids re-fetching tiles and keeps z-order deterministic.
  useEffect(() => {
    if (!map) return;
    addOverlays(map);
    for (const [key, id] of Object.entries(LAYER_FOR)) {
      setLayerVisible(map, id!, on[key as LayerKey]);
    }
    // `on` is deliberately not a dependency — this runs once per map, and the
    // effect below handles subsequent changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (!map) return;
    for (const [key, id] of Object.entries(LAYER_FOR)) {
      setLayerVisible(map, id!, on[key as LayerKey]);
    }
  }, [map, on]);

  // 3D is camera pitch, not a layer — same as the app's stereographic mode.
  useEffect(() => {
    if (!map) return;
    map.easeTo({ pitch: on.terrain ? CAMERA.band.pitch : 0, duration: reduced ? 0 : 900 });
  }, [map, on.terrain, reduced]);

  const toggle = (key: LayerKey) => setOn((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="maps-band to-map to-map--dark">
      <div ref={hostRef} className="maps-band__canvas" aria-label="3D trail map of Crystal Mountain" role="img" />

      {status !== "ready" && (
        <span className="maps-band__note">
          MAP CAPTURE · FULL-BLEED 3D RESORT FLYOVER WITH TRACK OVERLAY
          <br />
          2656 × 1240
        </span>
      )}

      <div className="maps-layers">
        {TOGGLES.map((t) => (
          <button
            key={t.key}
            type="button"
            role="switch"
            aria-checked={on[t.key]}
            disabled={status !== "ready"}
            onClick={() => toggle(t.key)}
            className={`maps-layer ${on[t.key] ? "maps-layer--on" : ""}`}
          >
            {t.label}
          </button>
        ))}
        <p style={{ margin: "6px 2px 0", fontSize: 12.5, lineHeight: 1.6, color: "#B4B4BA" }}>
          Layers stack. Slope shading over satellite is how you find the north-facing snow three days after a storm.
        </p>
      </div>

      <div className="maps-run">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ width: 13, height: 13, background: "#fff", transform: "rotate(45deg)" }} aria-hidden="true" />
          <span style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>Gandy's Right</span>
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.75, color: "#B4B4BA" }}>
          1,240 ft vertical · 0.7 mi
          <br />
          Max sustained pitch 38.4°
          <br />
          North-facing, holds snow
          <br />
          <span style={{ color: "var(--teal-bright)", fontWeight: 600 }}>You've skied it 14× · best 2:08</span>
        </div>
      </div>
    </div>
  );
}
