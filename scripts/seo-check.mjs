/**
 * Contrôle SEO technique du site en production (pas du local).
 * Teste chaque URL du sitemap principal : statut, titre, description, canonical, H1, noindex,
 * puis le sitemap lui-même (URLs hors domaine, doublons) et robots.txt.
 * Ne mesure PAS les positions Google : pour cela, Search Console.
 *
 * Usage : npm run seo-check
 *         npm run seo-check -- --host=https://www.mathelin-plomberie.fr
 * Code de sortie 1 si une erreur bloquante est trouvée (avertissements = code 0).
 */
const arg = process.argv.find((a) => a.startsWith("--host="));
const BASE = (arg ? arg.slice(7) : "https://www.mathelin-plomberie.fr").replace(/\/$/, "");
const UA = { "User-Agent": "Mozilla/5.0 (compatible; SEOCheck/1.0)" };
const CONCURRENCY = 6;

const errors = [];
const warnings = [];
const err = (url, msg) => errors.push(`${url} : ${msg}`);
const warn = (url, msg) => warnings.push(`${url} : ${msg}`);
const path = (u) => u.replace(BASE, "") || "/";

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function check(url, status, html, finalUrl) {
  const p = path(url);
  if (status !== 200) return err(p, `HTTP ${status}${finalUrl !== url ? ` (→ ${finalUrl})` : ""}`);
  const title = pick(html, /<title[^>]*>([^<]*)<\/title>/i);
  const desc =
    pick(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    pick(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const canonical =
    pick(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
    pick(html, /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  const robots = pick(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;

  if (!title) err(p, "titre absent");
  else if (title.length > 70) warn(p, `titre long (${title.length} car.)`);
  if (!desc) err(p, "meta description absente");
  else if (desc.length > 160) warn(p, `description longue (${desc.length} car.)`);
  else if (desc.length < 70) warn(p, `description courte (${desc.length} car.)`);
  if (!canonical) err(p, "canonical absent");
  else if (canonical.replace(/\/$/, "") !== url.replace(/\/$/, "")) err(p, `canonical différent (${canonical})`);
  if (robots && /noindex/i.test(robots)) err(p, "noindex présent");
  if (h1 !== 1) err(p, `${h1} balise(s) H1 (attendu : 1)`);
  return title;
}

async function get(url) {
  const res = await fetch(url, { headers: UA, redirect: "follow" });
  return { status: res.status, html: await res.text(), finalUrl: res.url };
}

// --- sitemap ---
const sm = await get(`${BASE}/sitemap.xml`);
if (sm.status !== 200) {
  console.error(`Sitemap inaccessible : HTTP ${sm.status}`);
  process.exit(1);
}
const locs = [...sm.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const host = new URL(BASE).host;
const own = locs.filter((u) => new URL(u).host === host);
for (const u of locs.filter((u) => new URL(u).host !== host)) err("sitemap", `URL hors domaine : ${u}`);
const dup = locs.filter((u, i) => locs.indexOf(u) !== i);
for (const u of new Set(dup)) err("sitemap", `URL en double : ${u}`);
for (const u of own.filter((u) => /\b20\d\d\b/.test(path(u)))) warn(path(u), "année dans l'URL (règle : pas de date)");

// --- robots.txt ---
const rb = await get(`${BASE}/robots.txt`);
if (rb.status !== 200) err("robots.txt", `HTTP ${rb.status}`);
else {
  if (!/^Sitemap:/im.test(rb.html)) err("robots.txt", "ligne Sitemap absente");
  if (/^Disallow:\s*\/\s*$/im.test(rb.html)) err("robots.txt", "Disallow: / (site bloqué)");
}

// --- pages ---
const titles = new Map();
let next = 0;
async function worker() {
  while (next < own.length) {
    const url = own[next++];
    try {
      const { status, html, finalUrl } = await get(url);
      const title = check(url, status, html, finalUrl);
      if (title) titles.set(title, [...(titles.get(title) || []), path(url)]);
    } catch (e) {
      err(path(url), `requête échouée (${e.message})`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
for (const [t, urls] of titles) if (urls.length > 1) warn(urls.join(", "), `même titre : « ${t} »`);

// --- accueil : en-têtes ---
const home = await fetch(BASE + "/", { headers: UA });
if (home.headers.get("set-cookie")) warn("/", "cookie posé (le site se veut sans cookie)");
if (!home.headers.get("strict-transport-security")) warn("/", "HSTS absent");

// --- verdict ---
console.log(`\nContrôle SEO — ${BASE} — ${own.length} pages du sitemap`);
if (errors.length) console.log(`\nERREURS (${errors.length})\n  ` + errors.join("\n  "));
if (warnings.length) console.log(`\nAVERTISSEMENTS (${warnings.length})\n  ` + warnings.join("\n  "));
if (!errors.length && !warnings.length) console.log("\nTout est conforme.");
console.log(`\nRésultat : ${errors.length ? "ÉCHEC" : "OK"} — ${errors.length} erreur(s), ${warnings.length} avertissement(s)`);
process.exit(errors.length ? 1 : 0);
