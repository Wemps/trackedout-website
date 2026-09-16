/*
 * Generates public/favicon.png and public/og-image.png from the brand assets.
 * Re-run after a logo change:  npm i --no-save sharp && node scripts/build-social.mjs
 */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const LOGO = 'design/assets/logo-trackedout.svg';

// Favicon: on the brand gradient, not the ink ground — the mark's mountain is
// near-black, so on ink only the script half survives and the silhouette vanishes.
const faviconGround = Buffer.from(
  `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
     <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
       <stop offset="0" stop-color="#FFFA00"/><stop offset="1" stop-color="#C6EE7A"/>
     </linearGradient></defs>
     <rect width="512" height="512" rx="96" fill="url(#g)"/>
   </svg>`,
);

const favicon = await sharp(faviconGround)
  .composite([
    {
      input: await sharp(readFileSync(LOGO), { density: 600 })
        .resize({ width: 452, fit: 'inside' })
        .png()
        .toBuffer(),
      gravity: 'center',
    },
  ])
  .png()
  .toFile('public/favicon.png');

// OG card: 1200x630 on the brand gradient, matching the download band.
const gradient = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
     <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
       <stop offset="0" stop-color="#FFFA00"/><stop offset="1" stop-color="#C6EE7A"/>
     </linearGradient></defs>
     <rect width="1200" height="630" fill="url(#g)"/>
   </svg>`,
);

const og = await sharp(gradient)
  .composite([
    {
      input: await sharp(readFileSync(LOGO), { density: 600 })
        .resize({ width: 820, fit: 'inside' })
        .png()
        .toBuffer(),
      gravity: 'center',
    },
  ])
  .png()
  .toFile('public/og-image.png');

console.log(`favicon.png  ${favicon.width}x${favicon.height}  ${(favicon.size / 1024).toFixed(0)}KB`);
console.log(`og-image.png ${og.width}x${og.height}  ${(og.size / 1024).toFixed(0)}KB`);
