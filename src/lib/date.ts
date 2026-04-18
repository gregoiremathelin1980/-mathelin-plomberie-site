const MONTHS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/**
 * Format date for display: "15 janvier 2025"
 * Accepte YYYY-MM-DD, chaîne ISO, Date (frontmatter YAML).
 */
export function formatDateFR(dateStr: string | Date | undefined | null): string {
  if (dateStr == null || dateStr === "") return "";
  if (dateStr instanceof Date) {
    if (Number.isNaN(dateStr.getTime())) return "";
    const day = dateStr.getDate();
    const month = MONTHS_FR[dateStr.getMonth()];
    const year = dateStr.getFullYear();
    return `${day} ${month} ${year}`;
  }
  const raw = typeof dateStr === "string" ? dateStr : String(dateStr);
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (ymd) {
    const year = Number(ymd[1]);
    const monthIdx = Number(ymd[2]) - 1;
    const day = Number(ymd[3]);
    const month = MONTHS_FR[monthIdx];
    if (month && day >= 1 && day <= 31 && monthIdx >= 0 && monthIdx < 12) {
      return `${day} ${month} ${year}`;
    }
  }
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const day = d.getDate();
  const month = MONTHS_FR[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/** Format for list: "mars 2026" */
export function formatMonthYearFR(dateStr: string | Date | undefined | null): string {
  if (dateStr == null || dateStr === "") return "";
  if (dateStr instanceof Date) {
    if (Number.isNaN(dateStr.getTime())) return "";
    return `${MONTHS_FR[dateStr.getMonth()]} ${dateStr.getFullYear()}`;
  }
  const raw = typeof dateStr === "string" ? dateStr : String(dateStr);
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return `${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
}
