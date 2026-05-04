/**
 * Génère des WebP pour le Hero et les visuels locaux du site principal.
 * Exécution : npm run optimize-images (après npm install)
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pub = path.join(root, "public", "images");

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location).then(resolve).catch(reject);
          res.resume();
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} pour ${url}`));
          res.resume();
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

async function main() {
  const heroUrl =
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1920&q=80&auto=format";
  const buf = await download(heroUrl);
  await sharp(buf)
    .resize(1920, null, { withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(pub, "hero-plombier.webp"));
  console.log("public/images/hero-plombier.webp");

  for (const f of ["carte-visite.jpg", "installation-plomberie-ain.jpg"]) {
    const p = path.join(pub, f);
    if (!fs.existsSync(p)) {
      console.warn("ignore (absent):", f);
      continue;
    }
    const base = f.replace(/\.jpe?g$/i, "");
    await sharp(p).webp({ quality: 82 }).toFile(path.join(pub, `${base}.webp`));
    console.log(`public/images/${base}.webp`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
