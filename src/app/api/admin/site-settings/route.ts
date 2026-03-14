import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  getSiteDataSettings,
  writeSiteDataSettings,
  type SiteDataSettings,
} from "@/lib/site-data";
import { clearSiteSettingsCache } from "@/lib/content";

const COOKIE_NAME = "admin_auth";
const SALT = "mathelin-admin";

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.ADMIN_PASSWORD || "";
  const expected = crypto.createHmac("sha256", secret).update(SALT).digest("hex");
  return expected.length > 0 && token === expected;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const settings = getSiteDataSettings();
    return NextResponse.json(settings ?? {});
  } catch {
    return NextResponse.json(
      { error: "Impossible de lire les paramètres" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const settings: SiteDataSettings = {
      entreprise: typeof body.entreprise === "string" ? body.entreprise : undefined,
      nom_contact: typeof body.nom_contact === "string" ? body.nom_contact : undefined,
      telephone: typeof body.telephone === "string" ? body.telephone : undefined,
      email: typeof body.email === "string" ? body.email : undefined,
      zone: typeof body.zone === "string" ? body.zone : undefined,
      messageUrgence: typeof body.messageUrgence === "string" ? body.messageUrgence : undefined,
      showAdviceImages: typeof body.showAdviceImages === "boolean" ? body.showAdviceImages : undefined,
      showChantierPhotos: typeof body.showChantierPhotos === "boolean" ? body.showChantierPhotos : undefined,
    };
    writeSiteDataSettings(settings);
    clearSiteSettingsCache();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Impossible d'enregistrer (écriture fichier)" },
      { status: 500 }
    );
  }
}
