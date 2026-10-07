import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Delivery copies only: keep the existing gallery, social images and originals.
// Bump this directory version before regenerating changed immutable assets.
const root = fileURLToPath(new URL("../", import.meta.url));
const prefix = "/images/home-v1";
const output = path.join(root, "public", prefix);
await mkdir(output, { recursive: true });
const groups = {
  hotel: [7, 9, 11, 14, 18, 21, 26],
  eco: [9, 10],
  double: [1],
  triple: [4],
  family: [7],
};
const manifest = {};
for (const [group, numbers] of Object.entries(groups)) {
  const photos = JSON.parse(await readFile(path.join(root, `app/lib/${group}-photo-manifest.json`), "utf8"));
  for (const number of numbers) {
    const photo = photos.find((item) => item.number === number);
    if (!photo) throw new Error(`Missing ${group} photo ${number}`);
    const source = path.join(root, "public", photo.full.src);
    const variants = [];
    for (const width of [320, 480, 640, 960, 1280, 1920]) {
      const src = `${prefix}/${group}-${number}-${width}.webp`;
      const info = await sharp(source).resize({ width, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 }).toFile(path.join(root, "public", src));
      variants.push({ src, width: info.width, height: info.height });
    }
    manifest[photo.variants.at(-1).src] = variants;
  }
}
// Keep the same full frame so CSS object-position matches the video at every size.
for (const [name, width, height] of [["hero-desktop", 1920, 1080], ["hero-mobile", 960, 540]]) {
  const info = await sharp(path.join(root, "public/videos/mi-hotel-home-poster.jpg"))
    .resize({ width, height, fit: "cover", position: "centre" })
    .webp({ quality: 82, effort: 6 }).toFile(path.join(output, `${name}.webp`));
  console.log(`${name}: ${info.size} bytes (${info.width}x${info.height})`);
}
await writeFile(path.join(root, "app/lib/home-image-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Prepared ${Object.keys(manifest).length} homepage photos; gallery originals unchanged.`);
