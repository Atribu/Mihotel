import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Generate delivery assets only; the supplied JPEG originals remain untouched.
const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error("Pass the folder containing Genel Mekan 1.jpg through Genel Mekan 28.jpg.");

const projectDirectory = fileURLToPath(new URL("../", import.meta.url));
const publicPrefix = "/images/hotel/high-res";
const outputDirectory = path.join(projectDirectory, "public", publicPrefix);
const manifest = [];
let originalBytes = 0;
let deliveryBytes = 0;

await mkdir(outputDirectory, { recursive: true });
for (let number = 1; number <= 28; number += 1) {
  const source = path.join(sourceDirectory, `Genel Mekan ${number}.jpg`);
  originalBytes += (await stat(source)).size;
  const basename = `genel-mekan-${String(number).padStart(2, "0")}`;
  const variants = [];

  for (const edge of [640, 1280, 1920]) {
    const filename = `${basename}-${edge}.webp`;
    const info = await sharp(source)
      .rotate()
      .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88, effort: 5 })
      .toFile(path.join(outputDirectory, filename));
    deliveryBytes += info.size;
    variants.push({ src: `${publicPrefix}/${filename}`, width: info.width, height: info.height });
  }

  // Full-screen images keep the entire original pixel dimensions and composition.
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

// Generated asset metadata, used by both the pages and the gallery.
await writeFile(path.join(projectDirectory, "app/lib/hotel-photo-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ photos: manifest.length, originalBytes, deliveryBytes }));
