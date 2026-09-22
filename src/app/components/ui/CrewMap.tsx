import type { ReactNode } from "react";
import { CAMERA, HAS_MAPBOX, STYLE } from "../../map/config";
import { projectToImage, staticMapURL } from "../../map/staticImage";
import { CREW, CREW_AVATARS } from "../../data/crew";

const WIDTH = 560;
const HEIGHT = 360;
const VIEW = { center: CAMERA.crew.center, zoom: CAMERA.crew.zoom, width: WIDTH, height: HEIGHT };

/**
 * The live crew map in the Crew section.
 *
 * Static image plus DOM pins: the map never moves, so there is nothing for GL JS
 * to do here that an `<img>` cannot, and this way the section costs one cached
 * image request instead of a billed map load.
 *
 * The light basic style is used because this section sits on white — the dark
 * style would fight it. Pins are projected from real coordinates (see
 * projectToImage) rather than positioned by eye, so they stay on their runs if
 * the camera is ever retuned.
 */
export function CrewMap({ children }: { children?: ReactNode }) {
  const src = HAS_MAPBOX
    ? staticMapURL({ style: STYLE.light, ...VIEW })
    : null;

  return (
    <div className="crew-aside crew-map to-map">
      {children}
      {src ? (
        <>
          <img
            src={src}
            alt="Trail map of Crystal Mountain with the crew's positions"
            width={WIDTH}
            height={HEIGHT}
            loading="lazy"
            decoding="async"
            className="to-map__img"
          />
          <div className="crew-pins" aria-hidden="true">
            {CREW.map((member) => {
              const { x, y } = projectToImage(member.position, VIEW);
              return (
                <span
                  key={member.name}
                  className={`crew-pin ${member.fresh ? "crew-pin--live" : ""}`}
                  style={{
                    left: `${(x / WIDTH) * 100}%`,
                    top: `${(y / HEIGHT) * 100}%`,
                    background: CREW_AVATARS[member.tone],
                  }}
                >
                  <span className="crew-pin__label">{member.name}</span>
                </span>
              );
            })}
          </div>
        </>
      ) : (
        <span className="maps-band__note" style={{ position: "absolute", left: 20, bottom: 20 }}>
          MAP CAPTURE · CREW PINS ON TRAIL MAP
          <br />
          1120 × 720
        </span>
      )}
    </div>
  );
}
