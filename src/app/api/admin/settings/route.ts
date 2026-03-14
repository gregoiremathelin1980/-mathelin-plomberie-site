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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const settings: SiteSettings = {
      company: body.company ?? "Mathelin Plomberie Chauffage",
      phone: body.phone ?? "",
      email: body.email ?? "",
      address: body.address ?? "",
      service_radius: body.service_radius ?? "15 km",
      homepage_message: body.homepage_message ?? undefined,
      business_hours: body.business_hours ?? undefined,
      cities: Array.isArray(body.cities) ? body.cities : [],
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
