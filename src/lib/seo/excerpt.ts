/** Retire la syntaxe markdown courante (titres, puces, gras, liens). */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extrait court (meta description) : premier paragraphe sans markdown, coupé en fin de phrase
 * sous `max` caractères, sinon en fin de mot.
 */
export function makeExcerpt(text: string, max = 155): string {
  const firstBlock =
    text
      .replace(/\r\n/g, "\n")
      .trim()
      .split(/\n{2,}/)
      .find((b) => stripMarkdown(b).length > 0) ?? "";
  const plain = stripMarkdown(firstBlock);
  if (plain.length <= max) return plain;
  const window = plain.slice(0, max + 1);
  const sentenceEnd = Math.max(window.lastIndexOf(". "), window.lastIndexOf("! "), window.lastIndexOf("? "));
  if (sentenceEnd >= max * 0.5) return plain.slice(0, sentenceEnd + 1);
  const wordEnd = window.lastIndexOf(" ");
  return `${plain.slice(0, wordEnd > 0 ? wordEnd : max).replace(/[,;:\s]+$/, "")}…`;
}
