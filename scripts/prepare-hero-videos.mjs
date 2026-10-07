import { mkdir, access } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Requires an external FFmpeg with libx264 (FFMPEG_BINARY or ffmpeg on PATH).
// Originals are read-only. Bump optimized-v1 before changing published copies.
const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "public/videos/optimized-v1");
const source = path.join(root, "public/videos/mi-hotel-home-hq.mp4");
const binary = process.env.FFMPEG_BINARY || "ffmpeg";
const targets = [
  { name: "home-1080.mp4", args: ["-crf", "23", "-maxrate", "4M", "-bufsize", "8M", "-profile:v", "high", "-level:v", "4.1", "-refs", "4"] },
  { name: "home-720.mp4", args: ["-vf", "scale=-2:720:flags=lanczos", "-crf", "24", "-maxrate", "1800k", "-bufsize", "3600k"] },
];
// Refuse to overwrite immutable delivery copies accidentally.
for (const { name } of targets) {
  const exists = await access(path.join(output, name)).then(() => true, () => false);
  if (exists) throw new Error(`${name} exists. Use a new versioned output directory.`);
}
await mkdir(output, { recursive: true });
for (const { name, args } of targets) {
  const result = spawnSync(binary, [
    "-nostdin", "-hide_banner", "-n", "-i", source, "-map", "0:v:0", "-an",
    "-c:v", "libx264", "-preset", "slow", ...args, "-pix_fmt", "yuv420p", "-threads", "4",
    "-movflags", "+faststart", path.join(output, name),
  ], { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`FFmpeg failed: ${name} (${result.status})`);
}
