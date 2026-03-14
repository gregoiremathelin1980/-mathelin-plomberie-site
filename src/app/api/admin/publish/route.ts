import { NextRequest, NextResponse } from "next/server";
import { updateContentDraft, type ContentType } from "@/lib/content";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const type = body?.type as ContentType | undefined;
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";

    if (
      !type ||
      !slug ||
      !["realisation", "blog", "conseil"].includes(type)
    ) {
      return NextResponse.json(
        { error: "Body must include type (realisation|blog|conseil) and slug" },
        { status: 400 }
      );
    }

    const ok = updateContentDraft(type, slug, false);
    if (!ok) {
      return NextResponse.json(
        { error: "File not found or could not update" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, type, slug });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to publish" },
      { status: 500 }
    );
  }
}
