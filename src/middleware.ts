import { NextRequest, NextResponse } from "next/server";

const MAIN_SITE_URL = "https://www.mathelin-plomberie.fr";

const MAIN_HOSTS = new Set(["www.mathelin-plomberie.fr", "mathelin-plomberie.fr"]);

const SATELLITE_DOMAINS: Record<string, string> = {
  "plombier-amberieu.fr": "/plombier-amberieu",
  "www.plombier-amberieu.fr": "/plombier-amberieu",
  "plombier-meximieux.fr": "/plombier-meximieux",
  "www.plombier-meximieux.fr": "/plombier-meximieux",
};

/** Chemins du site principal → domaine satellite (301, anti-cannibalisation). */
const PATH_TO_SATELLITE: Record<string, string> = {
  "/plombier-meximieux": "https://www.plombier-meximieux.fr/",
  "/plombier-amberieu": "https://www.plombier-amberieu.fr/",
};

/** Pages avec formulaire : on redirige les satellites vers le site principal (un seul domaine pour Formspree). */
const FORM_PAGES = ["/contact", "/devis"];

function isSatelliteAssetPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/api") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/llms.txt" ||
    /\.[a-z0-9]+$/i.test(pathname)
  );
}

function hostnameOnly(host: string): string {
  return host.split(":")[0]?.toLowerCase() ?? "";
}

export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host") ?? request.nextUrl.hostname;
  const host = hostnameOnly(hostHeader);
  const rawPath = request.nextUrl.pathname;
  const pathname = rawPath.replace(/\/$/, "") || "/";

  const rewritePath = SATELLITE_DOMAINS[host];
  const isSatellite = Boolean(rewritePath);

  if (isSatellite && FORM_PAGES.includes(pathname)) {
    return NextResponse.redirect(`${MAIN_SITE_URL}${pathname}`, 302);
  }

  // Satellites : seule l'accueil est propre ; toute autre page est une copie → 301 vers le site principal.
  // Exceptions : assets (_next, images, fichiers avec extension), API et fichiers SEO du domaine.
  if (isSatellite && pathname !== "/" && !isSatelliteAssetPath(pathname)) {
    return NextResponse.redirect(`${MAIN_SITE_URL}${pathname}${request.nextUrl.search}`, 301);
  }

  // Accueil satellite → rewrite vers la landing (inchangé)
  if (rewritePath && rawPath === "/") {
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;
    return NextResponse.rewrite(url);
  }

  // Sur le domaine principal (prod uniquement) : 301 des chemins vers les satellites
  // — localhost / previews Vercel non concernés → pas de régression en dev
  if (MAIN_HOSTS.has(host)) {
    const satelliteTarget = PATH_TO_SATELLITE[pathname];
    if (satelliteTarget) {
      return NextResponse.redirect(satelliteTarget, 301);
    }
  }

  return NextResponse.next();
}
