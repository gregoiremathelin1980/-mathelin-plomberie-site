import { NextRequest, NextResponse } from "next/server";

const MAIN_SITE_URL = "https://mathelin-plomberie.fr";

const SATELLITE_DOMAINS: Record<string, string> = {
  "plombier-amberieu.fr": "/plombier-amberieu",
  "www.plombier-amberieu.fr": "/plombier-amberieu",
  "plombier-meximieux.fr": "/plombier-meximieux",
  "www.plombier-meximieux.fr": "/plombier-meximieux",
};

/** Pages avec formulaire : on redirige les satellites vers le site principal (un seul domaine pour Formspree). */
const FORM_PAGES = ["/contact", "/devis"];

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? request.nextUrl.hostname;
  const pathname = request.nextUrl.pathname;

  const isSatellite = host && SATELLITE_DOMAINS[host];

  if (isSatellite && FORM_PAGES.includes(pathname)) {
    return NextResponse.redirect(`${MAIN_SITE_URL}${pathname}`, 302);
  }

  const rewritePath = SATELLITE_DOMAINS[host];
  if (rewritePath && (pathname === "/" || pathname === "")) {
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
