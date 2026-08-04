/** Parse a CLI token as a number, tolerating thousands separators. */
export function parseNumber(token: string): number | null {
  const cleaned = token.replace(/,/g, "");
  if (cleaned === "" || !/\d/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}
