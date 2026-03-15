import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  getSiteDataSettings,
  writeSiteDataSettings,
  getDefaultDisplaySettings,
  type SiteDataSettings,
  type DisplaySettings,
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
    const existing = getSiteDataSettings() ?? {};
    const defaults = getDefaultDisplaySettings();
    const ds = body.displaySettings && typeof body.displaySettings === "object" ? body.displaySettings : undefined;
    const displaySettings: DisplaySettings | undefined =
      ds && (typeof ds.showReviews === "boolean" || typeof ds.showAdvice === "boolean" || typeof ds.showAdviceImages === "boolean" || typeof ds.showEstimator === "boolean" || typeof ds.showRecentInterventions === "boolean")
        ? {
            showReviews: typeof ds.showReviews === "boolean" ? ds.showReviews : defaults.showReviews,
            showAdvice: typeof ds.showAdvice === "boolean" ? ds.showAdvice : defaults.showAdvice,
            showAdviceImages: typeof ds.showAdviceImages === "boolean" ? ds.showAdviceImages : defaults.showAdviceImages,
            showEstimator: typeof ds.showEstimator === "boolean" ? ds.showEstimator : defaults.showEstimator,
            showRecentInterventions: typeof ds.showRecentInterventions === "boolean" ? ds.showRecentInterventions : defaults.showRecentInterventions,
          }
        : existing?.displaySettings;

    const settings: SiteDataSettings = {
      ...existing,
      entreprise: typeof body.entreprise === "string" ? body.entreprise : existing?.entreprise,
      nom_contact: typeof body.nom_contact === "string" ? body.nom_contact : existing?.nom_contact,
      telephone: typeof body.telephone === "string" ? body.telephone : existing?.telephone,
      email: typeof body.email === "string" ? body.email : existing?.email,
      zone: typeof body.zone === "string" ? body.zone : existing?.zone,
      messageUrgence: typeof body.messageUrgence === "string" ? body.messageUrgence : existing?.messageUrgence,
      showAdviceImages: typeof body.showAdviceImages === "boolean" ? body.showAdviceImages : existing?.showAdviceImages,
      showChantierPhotos: typeof body.showChantierPhotos === "boolean" ? body.showChantierPhotos : existing?.showChantierPhotos,
      displaySettings: displaySettings ?? undefined,
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
