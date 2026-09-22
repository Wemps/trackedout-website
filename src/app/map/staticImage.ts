import { MAPBOX_TOKEN } from "./config";

interface StaticImageOptions {
  /** `wemps/<styleId>` — must be a style that does not import Mapbox Standard. */
  style: string;
  /** [lng, lat] */
  center: [number, number];
  zoom: number;
  /** CSS pixel size. `@2x` doubles it for retina; each value must be <= 1280. */
  width: number;
  height: number;
  bearing?: number;
  pitch?: number;
}

/**
 * A Mapbox Static Images API URL.
 *
 * `logo` and `attribution` are deliberately left at their defaults so the Mapbox
 * wordmark and the "© Mapbox © OpenStreetMap" line are baked into the returned
 * image — that satisfies the attribution requirement for these maps with no
 * extra markup, and stripping them would not.
 */
export function staticMapURL({
  style,
  center: [lng, lat],
  zoom,
  width,
  height,
  bearing = 0,
  pitch = 0,
}: StaticImageOptions) {
  const position = `${lng},${lat},${zoom},${bearing},${pitch}`;
  return (
    `https://api.mapbox.com/styles/v1/${style}/static/${position}` +
    `/${Math.round(width)}x${Math.round(height)}@2x?access_token=${MAPBOX_TOKEN}`
  );
}

/**
 * Where a [lng, lat] lands inside a static image, in CSS pixels from its
 * top-left corner.
 *
 * The Static Images API renders Web Mercator with 512px tiles, so the same
 * projection reproduces it exactly — which is how the crew pins sit on their
 * runs instead of being eyeballed percentages that drift whenever the camera
 * is nudged. Only valid for an unrotated, unpitched image.
 */
export function projectToImage(
  [lng, lat]: [number, number],
  {
    center: [centerLng, centerLat],
    zoom,
    width,
    height,
  }: { center: [number, number]; zoom: number; width: number; height: number },
) {
  const worldSize = 512 * 2 ** zoom;

  const toX = (l: number) => ((l + 180) / 360) * worldSize;
  const toY = (l: number) => {
    const rad = (l * Math.PI) / 180;
    const merc = Math.log(Math.tan(Math.PI / 4 + rad / 2));
    return (0.5 - merc / (2 * Math.PI)) * worldSize;
  };

  return {
    x: toX(lng) - toX(centerLng) + width / 2,
    y: toY(lat) - toY(centerLat) + height / 2,
  };
}
