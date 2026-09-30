/**
 * Exporte la carte de visite HTML en PNG haute résolution (1004×650 px, 85×55 mm @ 300 dpi).
 * Prérequis : serveur dev lancé sur le port 3001 (npm run dev).
 *
 * Usage : node scripts/export-carte-visite.mjs
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { spawnSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outPng = join(root, "public", "images", "carte-visite-v2.png");
const outWebp = join(root, "public", "images", "carte-visite-v2.webp");

const WIDTH = 1004;
const HEIGHT = 650;

/** Vérifie si le serveur répond */
async function serverUp() {
  try {
    const res = await fetch("http://localhost:3001/design/carte-visite-v2.html", { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

async function exportViaPlaywright() {
  try {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT + 80 } });
    await page.goto("http://localhost:3001/design/carte-visite-v2.html", { waitUntil: "networkidle" });
    const card = page.locator(".card");
    await card.screenshot({ path: outPng, type: "png" });
    await browser.close();
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await serverUp())) {
    console.error("Lancez d'abord : npm run dev (port 3001)");
    process.exit(1);
  }

  const ok = await exportViaPlaywright();
  if (!ok) {
    console.log(`
Export PNG automatique indisponible (Playwright non installé).

Alternative :
1. Ouvrir http://localhost:3001/design/carte-visite-v2.html
2. Zoom navigateur pour afficher la carte seule
3. Capture ou Imprimer → PDF pour l'imprimeur

La maquette HTML est prête dans public/design/carte-visite-v2.html
`);
    process.exit(0);
  }

  await sharp(outPng).webp({ quality: 92 }).toFile(outWebp);
  console.log("Export OK :", outPng, outWebp);
}

main();
