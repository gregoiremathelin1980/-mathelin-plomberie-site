/**
 * Tests automatisés : parsing avis GéoCompta, homepage, rotation, politique accueil.
 * Usage : npm run test
 * Optionnel (réseau) : GEOCOMPTA_API_BASE_URL (+ GEOCOMPTA_API_KEY) → vérifie GET /reviews une fois, sans faire échouer le script si absent.
 */

import assert from "node:assert/strict";
import { parseGeocomptaReviewList, GeocomptaHomepageSchema } from "../src/lib/api/geocomptaSchemas";
import {
  buildGeocomptaUrl,
  extractReviewsArrayFromPayload,
  GeocomptaApiError,
  getGeocomptaApiBaseUrl,
} from "../src/lib/api/geocomptaClient";
import { pickRotatingReviews } from "../src/lib/reviewsRotation";
import { allowSiteDataHomeReviewsEnv } from "../src/lib/reviewsHomePolicy";

function testParseCanonical() {
  const list = parseGeocomptaReviewList([
    { rating: 5, text: "Super travail", date: "2024-03-15", source: "google" },
  ]);
  assert.equal(list.length, 1);
  assert.equal(list[0]!.rating, 5);
  assert.equal(list[0]!.text, "Super travail");
  assert.equal(list[0]!.date, "2024-03-15");
  assert.equal(list[0]!.source, "google");
}

function testParseAliases() {
  const list = parseGeocomptaReviewList([
    {
      starRating: "5",
      reviewBody: "Bon dépannage",
      authorName: "Jean D.",
      date: "2024-06-01T12:00:00Z",
      source: "GOOGLE",
    },
  ]);
  assert.equal(list.length, 1);
  assert.equal(list[0]!.rating, 5);
  assert.equal(list[0]!.text, "Bon dépannage");
  assert.equal(list[0]!.author, "Jean D.");
  assert.equal(list[0]!.date, "2024-06-01");
  assert.equal(list[0]!.source, "GOOGLE");
}

function testParseSkipsInvalid() {
  const list = parseGeocomptaReviewList([
    { rating: 5, text: "OK" },
    { rating: 5 },
    {},
    { rating: 2, text: "  x  " },
  ]);
  assert.equal(list.length, 2);
  assert.equal(list[0]!.text, "OK");
  assert.equal(list[1]!.text, "x");
}

function testExtractPayload() {
  assert.deepEqual(extractReviewsArrayFromPayload([{ rating: 1, text: "a" }]), [{ rating: 1, text: "a" }]);
  assert.deepEqual(extractReviewsArrayFromPayload({ reviews: [{ rating: 1, text: "b" }] }), [{ rating: 1, text: "b" }]);
  assert.deepEqual(extractReviewsArrayFromPayload({ items: [{ rating: 1, text: "c" }] }), [{ rating: 1, text: "c" }]);
  assert.throws(() => extractReviewsArrayFromPayload({}), GeocomptaApiError);
}

function testHomepageFeaturedReviewsPartialBad() {
  const hp = GeocomptaHomepageSchema.parse({
    featuredRealisations: [],
    featuredAdvice: [],
    featuredReviews: [
      { rating: 5, text: "Valide" },
      { rating: 5 },
      { rating: 4, text: "Aussi valide" },
    ],
    featuredInterventions: [],
    featuredPhotos: [],
  });
  assert.equal(hp.featuredReviews.length, 2);
  assert.equal(hp.featuredReviews[0]!.text, "Valide");
  assert.equal(hp.featuredReviews[1]!.text, "Aussi valide");
}

/** GéoCompta peut envoyer le même wrapping que sur `GET /reviews` au lieu d’un tableau racine. */
function testHomepageFeaturedReviewsWrappedObject() {
  const hp = GeocomptaHomepageSchema.parse({
    featuredRealisations: [],
    featuredAdvice: [],
    featuredReviews: { reviews: [{ rating: 5, text: "Avis dans un objet reviews" }] },
    featuredInterventions: [],
    featuredPhotos: [],
  });
  assert.equal(hp.featuredReviews.length, 1);
  assert.equal(hp.featuredReviews[0]!.text, "Avis dans un objet reviews");
}

function testPickRotating() {
  const pool = [
    { rating: 5, text: "a", author: "1" },
    { rating: 5, text: "b", author: "2" },
    { rating: 5, text: "c", author: "3" },
    { rating: 5, text: "d", author: "4" },
  ];
  const a = pickRotatingReviews(pool, 2, 42);
  const b = pickRotatingReviews(pool, 2, 42);
  assert.equal(a.length, 2);
  assert.deepEqual(a, b);
  const all = pickRotatingReviews(pool, 10, 99);
  assert.equal(all.length, 4);
}

function testBuildGeocomptaUrl() {
  const prevBase = process.env.GEOCOMPTA_BASE_URL;
  const prevApi = process.env.GEOCOMPTA_API_BASE_URL;
  delete process.env.GEOCOMPTA_BASE_URL;
  delete process.env.GEOCOMPTA_API_BASE_URL;
  process.env.GEOCOMPTA_BASE_URL = "https://trigkey.example.ts.net:8443";
  assert.equal(buildGeocomptaUrl("/api/public/reviews"), "https://trigkey.example.ts.net:8443/api/public/reviews");
  if (prevBase !== undefined) process.env.GEOCOMPTA_BASE_URL = prevBase;
  else delete process.env.GEOCOMPTA_BASE_URL;
  if (prevApi !== undefined) process.env.GEOCOMPTA_API_BASE_URL = prevApi;
  else delete process.env.GEOCOMPTA_API_BASE_URL;
}

function testHomePolicy() {
  assert.equal(allowSiteDataHomeReviewsEnv("production", undefined), false);
  assert.equal(allowSiteDataHomeReviewsEnv("production", "false"), false);
  assert.equal(allowSiteDataHomeReviewsEnv("production", "true"), false);
  assert.equal(allowSiteDataHomeReviewsEnv("development", undefined), false);
  assert.equal(allowSiteDataHomeReviewsEnv("development", "true"), true);
  assert.equal(allowSiteDataHomeReviewsEnv(undefined, undefined), false);
}

async function optionalLiveFetch(): Promise<void> {
  const base = getGeocomptaApiBaseUrl();
  if (!base) {
    console.log("[test] live : ignoré (GEOCOMPTA_BASE_URL / GEOCOMPTA_API_BASE_URL absent)");
    return;
  }
  const url = `${base.replace(/\/$/, "")}/api/public/reviews`;
  const headers: Record<string, string> = { Accept: "application/json" };
  const key = process.env.GEOCOMPTA_API_KEY?.trim();
  if (key) headers.Authorization = `Bearer ${key}`;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) });
  const body = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(body) as unknown;
  } catch {
    console.log("[test] live : réponse non-JSON, status", res.status);
    return;
  }
  const raw = extractReviewsArrayFromPayload(json);
  const list = parseGeocomptaReviewList(raw);
  console.log("[test] live : HTTP", res.status, "→ items bruts", raw.length, "→ parsés", list.length);
  if (!res.ok) {
    console.log("[test] live : échec HTTP (vérifier URL / clé). Pas d’échec du script de test.");
  }
}

async function main() {
  testParseCanonical();
  testParseAliases();
  testParseSkipsInvalid();
  testExtractPayload();
  testHomepageFeaturedReviewsPartialBad();
  testHomepageFeaturedReviewsWrappedObject();
  testPickRotating();
  testBuildGeocomptaUrl();
  testHomePolicy();
  await optionalLiveFetch();
  console.log("[test] geocompta-reviews : OK (tous les tests unitaires passés)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
