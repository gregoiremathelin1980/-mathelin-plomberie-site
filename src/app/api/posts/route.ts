import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/content";

export function GET() {
  const posts = getBlogPosts();
  return NextResponse.json(posts);
}
