/**
 * Images for advice article cards by category.
 * Realistic residential plumbing photos for an editorial look.
 * Fallback used when category has no match.
 */

const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

export const ADVICE_IMAGE_BY_CATEGORY: Record<string, string> = {
  Radiateurs: U("1584568691250-31d8d0b053e9"), // radiator
  Canalisation: U("1558618666-fcd25c85cd64"), // sink / drain
  "Chauffe-eau": U("1600585154340-ef313acf8d54"), // water heater / bathroom
  Robinetterie: U("1584622650111-993a426fbf0a"), // faucet
  Fuite: U("1600607687939-ce8a6c25118c"), // pipe / plumbing
  Plomberie: U("1600573472592-401b489a3cdc"), // kitchen plumbing
};

/** Fallback when no category match: subtle residential plumbing */
export const ADVICE_IMAGE_FALLBACK = U("1600566753086-00f18fb6b3ea");

export function getAdviceCardImage(category: string | undefined, slug?: string): string {
  if (category && ADVICE_IMAGE_BY_CATEGORY[category]) {
    return ADVICE_IMAGE_BY_CATEGORY[category];
  }
  if (slug) {
    if (slug.includes("radiateur") || slug.includes("purge") || slug.includes("desembouage"))
      return ADVICE_IMAGE_BY_CATEGORY.Radiateurs;
    if (slug.includes("evier") || slug.includes("bouch") || slug.includes("canalisation") || slug.includes("toilette") || slug.includes("douche"))
      return ADVICE_IMAGE_BY_CATEGORY.Canalisation;
    if (slug.includes("chauffe-eau") || slug.includes("ballon") || slug.includes("eau-chaude"))
      return ADVICE_IMAGE_BY_CATEGORY["Chauffe-eau"];
    if (slug.includes("robinet") || slug.includes("fuite") || slug.includes("mousseur"))
      return ADVICE_IMAGE_BY_CATEGORY.Robinetterie;
  }
  return ADVICE_IMAGE_FALLBACK;
}
