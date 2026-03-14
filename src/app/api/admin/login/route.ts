import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

const COOKIE_NAME = "admin_auth";
const SALT = "mathelin-admin";

function getExpectedToken(): string {
  const secret = process.env.ADMIN_PASSWORD || "";
  return crypto.createHmac("sha256", secret).update(SALT).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";
    const expected = getExpectedToken();
    const actual = crypto.createHmac("sha256", password).update(SALT).digest("hex");
    if (expected.length === 0) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD non configuré" },
        { status: 500 }
      );
    }
    if (actual !== expected) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }
    const token = getExpectedToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
