/**
 * Fetches free plumbing/heating images from Pexels and saves them in
 * public/images/conseils/{category}/ for advice articles.
 *
 * Usage: npm run fetch-advice-images   (or: npx tsx scripts/fetch-advice-images.ts)
 * Requires: PEXELS_API_KEY in .env
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import axios from "axios";

const CONSEILS_BASE = path.join(process.cwd(), "public", "images", "conseils");
const IMAGES_PER_CATEGORY = 10;
const MIN_WIDTH = 1200;

const CATEGORIES: Record<string, string> = {
  radiateur: "radiator heating system",
  "chauffe-eau": "water heater plumber repair",
  evier: "kitchen sink plumbing repair",
  robinet: "faucet repair plumber",
  canalisation: "drain pipe plumbing repair",
  chauffage: "heating system radiator installation",
  plomberie: "plumber repairing pipes",
  "toilette-suspendue": "wall hung toilet installation",
  douche: "shower plumbing installation",
  chaudiere: "boiler heating system installation",
  climatisation: "air conditioning installation technician",
  "plancher-chauffant": "underfloor heating system installation",
};

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  src: { original: string };
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
  next_page?: string;
}

function getApiKey(): string {
  const key = process.env.PEXELS_API_KEY;
  if (!key || key === "your_api_key_here") {
    throw new Error("Missing or invalid PEXELS_API_KEY in .env");
  }
  return key;
}

async function searchPexels(query: string, apiKey: string, page: number): Promise<PexelsSearchResponse> {
  const url = "https://api.pexels.com/v1/search";
  const res = await axios.get<PexelsSearchResponse>(url, {
    params: { query, per_page: 20, page },
    headers: { Authorization: apiKey },
  });
  return res.data;
}

async function downloadFile(url: string): Promise<Buffer> {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(res.data);
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function fetchCategory(category: string, keyword: string, apiKey: string): Promise<void> {
  const dir = path.join(CONSEILS_BASE, category);
  ensureDir(dir);

  const existing = fs.readdirSync(dir).filter((n) => /\.(jpg|jpeg|png|webp)$/i.test(n));
  const existingNumbers = existing
    .map((n) => parseInt(n.replace(/^.*-(\d+)\.[^.]+$/, "$1"), 10))
    .filter((n) => !Number.isNaN(n));
  let nextIndex = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
  const targetCount = IMAGES_PER_CATEGORY;
  if (existing.length >= targetCount) {
    console.log(`  [${category}] already has ${existing.length} images, skipping.`);
    return;
  }

  const seenUrls = new Set<string>();
  let page = 1;
  let saved = 0;
  const toFetch = targetCount - existing.length;

  while (saved < toFetch) {
    const res = await searchPexels(keyword, apiKey, page);
    const photos = res.photos ?? [];

    const valid = photos.filter(
      (p: PexelsPhoto) =>
        p.width >= MIN_WIDTH &&
        p.height > 0 &&
        p.width > p.height &&
        p.src?.original &&
        !seenUrls.has(p.src.original)
    );

    for (const p of valid) {
      if (saved >= toFetch) break;
      seenUrls.add(p.src.original);
      const ext = p.src.original.includes(".png") ? ".png" : ".jpg";
      const filename = `${category}-${nextIndex}${ext}`;
      const filepath = path.join(dir, filename);
      try {
        const buffer = await downloadFile(p.src.original);
        fs.writeFileSync(filepath, buffer);
        nextIndex++;
        saved++;
        console.log(`  [${category}] saved ${filename}`);
      } catch (err) {
        console.warn(`  [${category}] failed to save ${filename}:`, err);
      }
    }

    if (photos.length < 20 || valid.length === 0) break;
    page++;
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`  [${category}] total: ${existing.length + saved} images.`);
}

async function main(): Promise<void> {
  console.log("Fetching advice images from Pexels...\n");
  const apiKey = getApiKey();
  ensureDir(CONSEILS_BASE);

  for (const [category, keyword] of Object.entries(CATEGORIES)) {
    try {
      await fetchCategory(category, keyword, apiKey);
    } catch (err) {
      console.error(`  [${category}] error:`, err);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("\nDone. Images are in public/images/conseils/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
