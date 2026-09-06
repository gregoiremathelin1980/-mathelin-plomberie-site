async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOAudit/1.0)" },
    redirect: "follow",
  });
  const text = await res.text();
  return { url, status: res.status, finalUrl: res.url, text, headers: Object.fromEntries(res.headers) };
}

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function all(html, re) {
  return [...html.matchAll(re)].map((m) => m[1]);
}

function analyzePage(html, url) {
  const title = pick(html, /<title[^>]*>([^<]*)<\/title>/i);
  const desc = pick(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    || pick(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const canonical = pick(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)
    || pick(html, /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  const robots = pick(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
  const ogTitle = pick(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);
  const ogUrl = pick(html, /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']*)["']/i);
  const h1s = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map((s) => s.replace(/<[^>]+>/g, "").trim());
  const h2Count = (html.match(/<h2[\s>]/gi) || []).length;
  const imgs = (html.match(/<img[\s>]/gi) || []).length;
  const imgsNoAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/gi) || []).length;
  const ldBlocks = all(html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const types = [];
  let agg = 0;
  let reviews = 0;
  for (const b of ldBlocks) {
    try {
      const j = JSON.parse(b);
      const t = j["@type"];
      types.push(Array.isArray(t) ? t.join("+") : String(t || "?"));
      if (JSON.stringify(j).includes("aggregateRating")) agg++;
      if (t === "Review" || (Array.isArray(t) && t.includes("Review"))) reviews++;
    } catch {
      types.push("PARSE_ERROR");
    }
  }
  const internalLinks = (html.match(/href=["']\/[^"']*["']/g) || []).length;
  const hasContact = /id=["']contact["']/i.test(html) || /ContactForm|Demander un devis|contact/i.test(html);
  return {
    url,
    title,
    titleLen: title?.length ?? 0,
    desc,
    descLen: desc?.length ?? 0,
    canonical,
    robots,
    ogTitle,
    ogUrl,
    h1s,
    h2Count,
    imgs,
    imgsNoAlt,
    jsonLdTypes: types,
    aggregateRatingBlocks: agg,
    reviewBlocks: reviews,
    internalLinksApprox: internalLinks,
    hasContactAnchor: hasContact,
    htmlKB: Math.round(html.length / 1024),
  };
}

const urls = [
  "https://www.mathelin-plomberie.fr/",
  "https://www.mathelin-plomberie.fr/blog",
  "https://www.mathelin-plomberie.fr/conseils",
  "https://www.mathelin-plomberie.fr/services",
  "https://www.mathelin-plomberie.fr/contact",
  "https://www.mathelin-plomberie.fr/devis",
  "https://www.plombier-meximieux.fr/",
  "https://www.plombier-amberieu.fr/",
  "https://www.mathelin-plomberie.fr/conseils/toilettes-bouchees",
  "https://www.mathelin-plomberie.fr/services/reparation-fuite",
];

// Anti-cannibalisation : les chemins /plombier-* doivent 301 vers les satellites
const redirectChecks = [
  {
    from: "https://www.mathelin-plomberie.fr/plombier-meximieux",
    expect: "https://www.plombier-meximieux.fr/",
  },
  {
    from: "https://www.mathelin-plomberie.fr/plombier-amberieu",
    expect: "https://www.plombier-amberieu.fr/",
  },
];

const pages = [];
for (const u of urls) {
  try {
    const { status, text, finalUrl } = await fetchText(u);
    const a = analyzePage(text, u);
    a.status = status;
    a.finalUrl = finalUrl;
    pages.push(a);
  } catch (e) {
    pages.push({ url: u, error: String(e) });
  }
}

const redirects = [];
for (const { from, expect } of redirectChecks) {
  try {
    const res = await fetch(from, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOAudit/1.0)" },
      redirect: "manual",
    });
    const loc = res.headers.get("location");
    redirects.push({
      from,
      status: res.status,
      location: loc,
      ok: res.status === 301 && (loc === expect || loc === expect.replace(/\/$/, "")),
    });
  } catch (e) {
    redirects.push({ from, error: String(e), ok: false });
  }
}

const robots = await fetchText("https://www.mathelin-plomberie.fr/robots.txt");
const sitemap = await fetchText("https://www.mathelin-plomberie.fr/sitemap.xml");
const sm = sitemap.text;
const locCount = (sm.match(/<loc>/g) || []).length;
const conseils = (sm.match(/\/conseils\//g) || []).length;
const services = (sm.match(/\/services\//g) || []).length;
const urgence = (sm.match(/\/urgence\//g) || []).length;
const realisations = (sm.match(/\/realisations\//g) || []).length;

console.log(JSON.stringify({
  pages,
  redirects,
  robotsTxt: robots.text.slice(0, 800),
  sitemap: { status: sitemap.status, locCount, conseils, services, urgence, realisations, sizeKB: Math.round(sm.length / 1024) },
}, null, 2));
