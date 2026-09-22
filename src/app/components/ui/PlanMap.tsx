import { CAMERA, HAS_MAPBOX, STYLE } from "../../map/config";
import { staticMapURL } from "../../map/staticImage";

const WIDTH = 360;
const HEIGHT = 340;

/**
 * The trail map behind demo chapter one.
 *
 * A static image rather than a live map: HANDOFF.md specifies this map is
 * non-interactive, so a GL JS instance would buy nothing and cost a billed map
 * load — one every 15.6s, in fact, since DayDemo remounts the active chapter on
 * every autoplay cycle. An `<img>` with a stable src just re-renders from cache.
 *
 * The design asked for CARTO's dark basemap; this uses the app's own
 * pre-Standard dark style instead, which is closer to the product and draws real
 * runs and lifts in a cyan that happens to match --teal-bright.
 */
export function PlanMap() {
  const src = HAS_MAPBOX
    ? staticMapURL({
        style: STYLE.dark,
        center: CAMERA.demo.center,
        zoom: CAMERA.demo.zoom,
        width: WIDTH,
        height: HEIGHT,
      })
    : null;

  return (
    <div
      className="demo-aside demo-map to-map to-map--dark"
      style={{
        width: WIDTH,
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid var(--hairline)",
        background: "var(--ink-deep)",
        position: "relative",
      }}
    >
      <div style={{ width: "100%", height: HEIGHT, position: "relative" }}>
        {src ? (
          <img
            src={src}
            alt="Trail map of Palisades Tahoe"
            width={WIDTH}
            height={HEIGHT}
            loading="lazy"
            decoding="async"
            className="to-map__img"
          />
        ) : (
          // No token configured: the contour wash and marker, minus the basemap.
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
          zIndex: 2,
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
          zIndex: 2,
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
