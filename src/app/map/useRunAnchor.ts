import { useEffect, useState } from "react";
import type { Map as MapboxMap } from "mapbox-gl";
import { HIGHLIGHT_RUN } from "./config";

/** Below this the band stacks into a column and the card goes back in flow. */
const PINNED_MIN_WIDTH = 901;

export interface RunAnchor {
  /** Pixel position of the run within the map container. */
  x: number;
  y: number;
  /** Whether the card should sit to the run's left to stay inside the frame. */
  flip: boolean;
}

/**
 * Where the highlighted run sits on screen, so the detail card can be pinned
 * beside it rather than parked in a corner.
 *
 * Projects the run's known coordinate rather than querying rendered features:
 * the latter only reports what the map has painted, which is nothing before
 * tiles arrive and nothing at all while the tab is in the background.
 *
 * Recomputed on `move` and `resize`. The band's camera does not move on its
 * own, so in practice this settles once and then only responds to layout.
 * Returns null when the viewport is too narrow to pin anything, or when the
 * run projects outside the frame — in both cases the card falls back to its
 * default corner.
 */
export function useRunAnchor(map: MapboxMap | null, cardWidth: number) {
  const [anchor, setAnchor] = useState<RunAnchor | null>(null);

  useEffect(() => {
    if (!map) return;

    const update = () => {
      if (window.innerWidth < PINNED_MIN_WIDTH) {
        setAnchor(null);
        return;
      }

      let point;
      try {
        point = map.project(HIGHLIGHT_RUN.at);
      } catch {
        return; // map torn down mid-flight
      }

      const container = map.getContainer();
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Off-frame: leave the card where it was designed to sit.
      if (point.x < 0 || point.y < 0 || point.x > width || point.y > height) {
        setAnchor(null);
        return;
      }

      setAnchor({
        x: point.x,
        y: point.y,
        flip: point.x + 28 + cardWidth > width - 24,
      });
    };

    map.on("move", update);
    window.addEventListener("resize", update);
    update();

    return () => {
      map.off("move", update);
      window.removeEventListener("resize", update);
    };
  }, [map, cardWidth]);

  return anchor;
}
