/**
 * Soumet les URL des sitemaps (site principal + satellites) à IndexNow (Bing, Yandex, Seznam…).
 * Bing alimente la recherche de ChatGPT et Copilot : à lancer après chaque déploiement en production.
 *
 * Usage : npm run indexnow            (soumet)
 *         npm run indexnow -- --dry   (affiche seulement les URL)
 *
 * La clé est publique par conception : elle doit être servie à https://<domaine>/<clé>.txt
 * (fichier dans public/, donc disponible sur les trois domaines).
 */
const KEY = "e0f71e90ae70ed6998df927a4f606c07";
const HOSTS = ["www.mathelin-plomberie.fr", "www.plombier-amberieu.fr", "www.plombier-meximieux.fr"];
const dry = process.argv.includes("--dry");

async function sitemapUrls(host) {
  const res = await fetch(`https://${host}/sitemap.xml`);
  if (!res.ok) throw new Error(`${host} : sitemap HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim())
    .filter((u) => new URL(u).host === host);
}

let failed = false;
for (const host of HOSTS) {
  try {
    const keyRes = await fetch(`https://${host}/${KEY}.txt`);
    if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) {
      throw new Error(`${host} : fichier de clé absent ou invalide (déployer d'abord)`);
    }
    const urlList = await sitemapUrls(host);
    if (dry) {
      console.log(`${host} : ${urlList.length} URL`);
      continue;
    }
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: KEY, keyLocation: `https://${host}/${KEY}.txt`, urlList }),
    });
    // 200 = accepté, 202 = accepté (clé en cours de validation)
    console.log(`${host} : ${urlList.length} URL → HTTP ${res.status}`);
    if (res.status !== 200 && res.status !== 202) failed = true;
  } catch (err) {
    console.error(err.message);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
