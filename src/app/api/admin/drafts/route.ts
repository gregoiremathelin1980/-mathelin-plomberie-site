import { NextResponse } from "next/server";
import {
  getAllRealisations,
  getAllBlogPosts,
  getAllConseils,
} from "@/lib/content";

export async function GET() {
  try {
    const [realisations, blog, conseils] = await Promise.all([
      getAllRealisations(),
      getAllBlogPosts(),
      getAllConseils(),
    ]);
    return NextResponse.json({
      realisations: realisations.filter((r) => r.draft === true),
      blog: blog.filter((p) => p.draft === true),
      conseils: conseils.filter((c) => c.draft === true),
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to list drafts" },
      { status: 500 }
    );
  }
}
