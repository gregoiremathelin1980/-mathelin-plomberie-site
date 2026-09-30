/**
 * Carte de visite : remplace l'orange du FOND uniquement (pas les photos hex).
 * Usage : npm run carte-visite
 */
import sharp from "sharp";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sourcePath = existsSync(join(root, "visu-greg.jpg"))
  ? join(root, "visu-greg.jpg")
  : join(root, "public", "images", "carte-visite-source.jpg");
const outDir = join(root, "public", "images");

const PRIMARY_LIGHT = { r: 139, g: 184, b: 224 };
const PRIMARY = { r: 107, g: 163, b: 212 };

function isOrangeBackground(r, g, b) {
  if (r < 180 || g < 140) return false;
  if (b > r * 0.85) return false;
  const orangeScore = r - b;
  const warmth = r - g;
  if (orangeScore < 25) return false;
  if (warmth < -10) return false;
  const lum = (r + g + b) / 3;
  if (lum < 160 || lum > 252) return false;
  return true;
}

function blueFromOrange(r, g, b) {
  const t = Math.min(1, (r - 180) / 60);
  return {
    r: Math.round(PRIMARY_LIGHT.r * (1 - t * 0.3) + PRIMARY.r * t * 0.3),
    g: Math.round(PRIMARY_LIGHT.g * (1 - t * 0.3) + PRIMARY.g * t * 0.3),
    b: Math.round(PRIMARY_LIGHT.b * (1 - t * 0.3) + PRIMARY.b * t * 0.3),
  };
}

async function main() {
  const sourceBuffer = readFileSync(sourcePath);
  const { data, info } = await sharp(sourceBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const pixels = Buffer.from(data);
  const leftLimit = Math.round(W * 0.54);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < leftLimit; x++) {
      const i = (y * W + x) * C;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      if (isOrangeBackground(r, g, b)) {
        const c = blueFromOrange(r, g, b);
        pixels[i] = c.r;
        pixels[i + 1] = c.g;
        pixels[i + 2] = c.b;
      }
    }
  }

  const logoPath = join(root, "public", "images", "logo-maitre-artisan.png");
  const logo = await sharp(logoPath).resize({ height: Math.round(H * 0.17) }).png().toBuffer();
  const logoMeta = await sharp(logo).metadata();

  const card = await sharp(pixels, { raw: { width: W, height: H, channels: C } })
    .composite([{ input: logo, left: W - logoMeta.width - 8, top: H - logoMeta.height - Math.round(H * 0.055) }])
    .png()
    .toBuffer();

  await sharp(card).webp({ quality: 92 }).toFile(join(outDir, "carte-visite-v2.webp"));
  writeFileSync(join(outDir, "carte-visite-v2.png"), card);

  console.log(`Généré : ${outDir}/carte-visite-v2.png`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
