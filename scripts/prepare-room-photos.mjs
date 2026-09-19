import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Create delivery copies only; never modify the supplied JPEG originals.
const [sourceDirectory, category, roomNumber, photoCount] = process.argv.slice(2);
const count = Number(photoCount);
if (!sourceDirectory || !/^[a-z][a-z0-9-]*$/.test(category ?? "") ||
    !/^\d+$/.test(roomNumber ?? "") || !Number.isInteger(count) || count < 1) {
  throw new Error("Usage: node scripts/prepare-room-photos.mjs <source-folder> <category> <room-number> <photo-count>");
}

const projectDirectory = fileURLToPath(new URL("../", import.meta.url));
const publicPrefix = `/images/rooms/${category}/high-res`;
const outputDirectory = path.join(projectDirectory, "public", publicPrefix);
const manifest = [];
let originalBytes = 0;
let deliveryBytes = 0;

await mkdir(outputDirectory, { recursive: true });
for (let number = 1; number <= count; number += 1) {
  const source = path.join(sourceDirectory, `Oda ${roomNumber} ${number}.jpg`);
  originalBytes += (await stat(source)).size;
  const basename = `${roomNumber}-${String(number).padStart(2, "0")}`;
  const variants = [];

  for (const edge of [640, 1280, 1920]) {
    const filename = `${basename}-${edge}.webp`;
    const info = await sharp(source).rotate()
      .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88, effort: 5 })
      .toFile(path.join(outputDirectory, filename));
    deliveryBytes += info.size;
    variants.push({ src: `${publicPrefix}/${filename}`, width: info.width, height: info.height });
  }

  // Keep the original pixel dimensions and full composition for the lightbox.
  const filename = `${basename}-full.webp`;
  const info = await sharp(source).rotate().webp({ quality: 92, effort: 5 })
    .toFile(path.join(outputDirectory, filename));
  deliveryBytes += info.size;
  manifest.push({
    number,
    variants,
    full: { src: `${publicPrefix}/${filename}`, width: info.width, height: info.height },
  });
  console.log(`${number}: ${info.width}x${info.height}, full-screen ${Math.round(info.size / 1024)} KiB`);
}

await writeFile(path.join(projectDirectory, `app/lib/${category}-photo-manifest.json`), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ photos: manifest.length, originalBytes, deliveryBytes }));
