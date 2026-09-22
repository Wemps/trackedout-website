/*
 * Turns the design handoff's raster assets into web-ready ones.
 *
 * Sources live in design/assets/ (the untouched handoff bundle); the optimised
 * results are written to src/assets/ and are what the app imports.
 *
 * NOTE: the two logo SVGs are gitignored (3MB each), so a fresh clone has the
 * generated WebP but not the sources. Restore them from the handoff bundle
 * before re-running the logo jobs below. Re-run after any asset is re-exported:
 *
 *   npm i --no-save sharp && node scripts/build-assets.mjs
 *
 * Two things this fixes:
 *  - The logo SVGs are traced outlines — one path in logo-trackedout.svg carries
 *    2.3M characters of `d` data, ~3.1MB per file (376KB gzipped even after
 *    precision reduction). Wrong order of magnitude for a mark that renders at
 *    168px tall. Until it's redrawn as real vector, it ships as a raster.
 *  - The PNGs are exported at 2–5x the width they're displayed at.
 *
 * `width` below is 2x the largest size each asset renders at, which is the point
 * past which more pixels buy nothing on a retina screen.
 */
import sharp from 'sharp';
import { readFileSync, statSync } from 'node:fs';

const JOBS = [
  // Logos: header renders at 120px * 1.4 scale = 168px tall; 3x from the 661x420
  // artboard is 792 wide.
  { src: 'logo-trackedout.svg', out: 'logo-trackedout.webp', width: 800 },
  { src: 'logo-wordmark.svg', out: 'logo-wordmark.webp', width: 800 },

  // Hero phone renders at 400px (hero) and 330px (demo chapter 3).
  { src: 'hero-phone-trim.png', out: 'hero-phone-trim.webp', width: 800 },

  // Sensei screen renders at 320px inside a 520px-tall frame that crops it.
  { src: 'screen-technique.png', out: 'screen-technique.webp', width: 640 },

  // Stat cards: widest is the 6-span metrics card at ~585px. Already close to 2x,
  // so these are re-encoded rather than resized.
  { src: 'stat-vertical.png', out: 'stat-vertical.webp' },
  { src: 'stat-turndirection.png', out: 'stat-turndirection.webp' },
  { src: 'stat-turntype.png', out: 'stat-turntype.webp' },
  { src: 'stat-speedzones.png', out: 'stat-speedzones.webp' },
  { src: 'stat-sessionlength.png', out: 'stat-sessionlength.webp' },
  { src: 'stat-overview-rows.png', out: 'stat-overview-rows.webp' },
];

let before = 0;
let after = 0;

for (const job of JOBS) {
  const src = `design/assets/${job.src}`;
  const out = `src/assets/${job.out}`;

  // density only affects SVG rasterisation; it is ignored for bitmap input.
  let pipeline = sharp(readFileSync(src), { density: 600 });
  if (job.width) pipeline = pipeline.resize({ width: job.width, withoutEnlargement: true });

  await pipeline.webp({ quality: 92, effort: 6 }).toFile(out);

  const inSize = statSync(src).size;
  const outSize = statSync(out).size;
  before += inSize;
  after += outSize;

  const meta = await sharp(out).metadata();
  console.log(
    `${job.src.padEnd(26)} ${(inSize / 1024).toFixed(0).padStart(6)}KB -> ` +
      `${(outSize / 1024).toFixed(0).padStart(5)}KB  ${meta.width}x${meta.height}`,
  );
}

console.log(
  `\ntotal ${(before / 1e6).toFixed(2)}MB -> ${(after / 1024).toFixed(0)}KB ` +
    `(${(100 - (after / before) * 100).toFixed(1)}% smaller)`,
);
