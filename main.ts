// gta6-clipper-01 entrypoint.
// Reads VIDEO.json from the repository root, validates that it names a
// YouTube video (shorts, watch, or youtu.be form), and copies it
// byte-identical into the output directory for the grader.
//
// The video itself already exists: it is the user's published Short
// "We Built a Playable GTA 6 Fan Game 🌴 VELVET BAY" (channel FluffyPaws).
// The clip's hook is playable GTA 6 fan-game "Velvet Bay" gameplay, and
// after the hook the clip carries the make.fun pitch — viewers can make
// money on make.fun by making cool clips with AI. This program does not
// cut, render, or upload any video; it only hands the video's address in.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const YOUTUBE_URL =
  /^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]{11}(?:[?#].*)?$/;

function fail(message: string): never {
  console.error("gta6-clipper-01: " + message);
  process.exit(1);
}

const sourcePath = "VIDEO.json";
let raw: string;
try {
  raw = readFileSync(sourcePath, "utf8");
} catch {
  fail("could not read " + sourcePath);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw!);
} catch {
  fail("VIDEO.json is not valid JSON");
}

if (
  typeof parsed !== "object" ||
  parsed === null ||
  Array.isArray(parsed) ||
  typeof (parsed as { url?: unknown }).url !== "string"
) {
  fail("VIDEO.json must be an object with a string url");
}

const url = (parsed as { url: string }).url;
if (!YOUTUBE_URL.test(url)) {
  fail("url is not a YouTube shorts/watch/youtu.be address: " + url);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "VIDEO.json");
writeFileSync(outPath, raw!);
console.log("gta6-clipper-01: validated " + url);
console.log("gta6-clipper-01: wrote " + outPath);
