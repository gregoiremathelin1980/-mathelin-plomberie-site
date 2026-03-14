import { NextResponse } from "next/server";
import { getRealisations } from "@/lib/content";

export function GET() {
  const realisations = getRealisations();
  return NextResponse.json(realisations);
}
