import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, writeSiteSettings } from "@/lib/content";
import type { SiteSettings } from "@/lib/content";

export async function GET() {
  try {
    const settings = getSiteSettings();
    return NextResponse.json(settings);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to read settings" },
      { status: 500 }
    );
  }
}

const defaultDisplaySettings = {
  showReviews: true,
  showAdvice: true,
  showAdviceImages: true,
  showEstimator: true,
  showRecentInterventions: true,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const existing = getSiteSettings();
    const settings: SiteSettings = {
      company: body.company ?? existing.company ?? "Mathelin Plomberie Chauffage",
      phone: body.phone ?? existing.phone ?? "",
      email: body.email ?? existing.email ?? "",
      address: body.address ?? existing.address ?? "",
      service_radius: body.service_radius ?? existing.service_radius ?? "15 km",
      homepage_message: body.homepage_message ?? existing.homepage_message ?? undefined,
      business_hours: body.business_hours ?? existing.business_hours ?? undefined,
      show_advice_images: typeof body.show_advice_images === "boolean" ? body.show_advice_images : existing.show_advice_images,
      show_chantier_photos: typeof body.show_chantier_photos === "boolean" ? body.show_chantier_photos : existing.show_chantier_photos,
      displaySettings: existing.displaySettings ?? defaultDisplaySettings,
      cities: Array.isArray(body.cities) ? body.cities : (existing.cities ?? []),
    };
    writeSiteSettings(settings);
    return NextResponse.json(settings);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to write settings" },
      { status: 500 }
    );
  }
}
