import { useEffect, useState } from "react";
import { ATMOSPHERE, CAMERA, HIGHLIGHT_RUN, SLOPE_MIN_ZOOM } from "../../map/config";
import { useMapbox } from "../../map/useMapbox";
import { addOverlays, showOverlay, type OverlayKey } from "../../map/layers";
import { useRunAnchor } from "../../map/useRunAnchor";
import { trackEvent } from "../../analytics";

/** `terrain` is the base view — the styled mountain with no overlay on it. */
type LayerKey = "terrain" | OverlayKey;

/** Matches the width in components.css; the anchor maths needs it in JS. */
const RUN_CARD_WIDTH = 290;

const TOGGLES: { key: LayerKey; label: string }[] = [
  { key: "terrain", label: "3D terrain" },
  { key: "satellite", label: "Satellite" },
  { key: "slope", label: "Slope shading" },
  { key: "north", label: "North aspect" },
];

/**
 * The highlighted run.
 *
 * Bear Pits is picked because it is genuinely in frame — 349m from the camera
 * centre, and labelled in the render. Its name, expert difficulty, backcountry
 * grooming and gladed flag are all real, read from the `wemps.runs` tileset.
 * The distances, the pitch and the personal history are illustrative marketing
 * copy, as they were in the design. Aspect follows the resort's overall
 * south/east orientation rather than a measurement.
 */
const RUN = {
  // Name comes from the shared constant so the card and the highlighted line on
  // the map can never point at different runs.
  name: HIGHLIGHT_RUN.name,
  vertical: "1,180 ft vertical · 0.6 mi",
  pitch: "Max sustained pitch 41.2°",
  character: "East-facing glades · expert",
  history: "You've skied it 9× · best 1:54",
};

/**
 * The Maps section's full-bleed band — the one live map on the page.
 *
 * It earns GL JS because its layer toggles are the section's whole point: they
 * demonstrate the same overlays the app ships. The other two maps on the page
 * are static images.
 *
 * One overlay at a time, cross-faded. The camera holds its pitch throughout —
 * the flyover is the section's payload — so "3D terrain" selects the bare
 * mountain rather than flattening it.
 */
export function ResortMap() {
  const { hostRef, map, status } = useMapbox({
    center: CAMERA.band.center,
    zoom: CAMERA.band.zoom,
    pitch: CAMERA.band.pitch,
    bearing: CAMERA.band.bearing,
    // Slope tiles are minzoom 13; below it the overlays silently vanish.
    minZoom: SLOPE_MIN_ZOOM,
  });

  const [active, setActive] = useState<LayerKey>("terrain");
  // Pins the detail card beside the highlighted run instead of the corner.
  const anchor = useRunAnchor(map, RUN_CARD_WIDTH);

  useEffect(() => {
    if (!map) return;
    addOverlays(map);
    // Must be applied for the camera to show anything at this pitch; see config.
    map.setFog(ATMOSPHERE as never);
  }, [map]);

  // The cleanup cancels any fade still in flight, so a pending timer can never
  // fire against a map that has already been removed.
  useEffect(() => {
    if (!map) return;
    return showOverlay(map, active === "terrain" ? null : active);
  }, [map, active]);

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

      <div className="maps-layers" role="radiogroup" aria-label="Map layer">
        {TOGGLES.map((t) => (
          <button
            key={t.key}
            type="button"
            role="radio"
            aria-checked={active === t.key}
            disabled={status !== "ready"}
            onClick={() => {
              setActive(t.key);
              trackEvent("map_layer_toggle", { layer: t.key });
            }}
            className={`maps-layer ${active === t.key ? "maps-layer--on" : ""}`}
          >
            {t.label}
          </button>
        ))}
        <p style={{ margin: "6px 2px 0", fontSize: 12.5, lineHeight: 1.6, color: "#B4B4BA" }}>
          Four ways to read the same mountain. Slope shading finds the pitch; north aspect finds the snow that survived
          the sun.
        </p>
      </div>

      {anchor && (
        <span
          className="maps-run__pin"
          style={{ left: anchor.x, top: anchor.y }}
          aria-hidden="true"
        />
      )}

      <div
        className={`maps-run ${anchor ? "maps-run--pinned" : ""}`}
        style={
          anchor
            ? {
                left: anchor.flip ? anchor.x - 28 - RUN_CARD_WIDTH : anchor.x + 28,
                // Clamped so a run near the top or bottom edge can't push the
                // card out of the band.
                top: Math.min(Math.max(anchor.y, 110), 510),
              }
            : undefined
        }
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ width: 13, height: 13, background: "#fff", transform: "rotate(45deg)" }} aria-hidden="true" />
          <span style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>{RUN.name}</span>
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.75, color: "#B4B4BA" }}>
          {RUN.vertical}
          <br />
          {RUN.pitch}
          <br />
          {RUN.character}
          <br />
          <span style={{ color: "var(--teal-bright)", fontWeight: 600 }}>{RUN.history}</span>
        </div>
      </div>
    </div>
  );
}
