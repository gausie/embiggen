/**
 * Group a number with commas for display: `1234567.5` -> `"1,234,567.5"`.
 *
 * Hand-rolled rather than `toLocaleString`, which mafia's Rhino doesn't
 * implement dependably, and built from string slicing rather than a lookbehind
 * regex for the same reason. Rounds to two decimal places; trailing zeroes are
 * dropped, so whole numbers stay whole.
 */
export function formatNumber(value: number): string {
  if (!isFinite(value)) return String(value);

  const rounded = Math.round(value * 100) / 100;
  const magnitude = Math.abs(rounded);
  const whole = Math.floor(magnitude);

  let remaining = String(whole);
  let grouped = "";
  while (remaining.length > 3) {
    grouped = `,${remaining.slice(-3)}${grouped}`;
    remaining = remaining.slice(0, -3);
  }
  grouped = remaining + grouped;

  // `String(0.25).slice(1)` is ".25" — the decimals with their point attached.
  const fraction = Math.round((magnitude - whole) * 100) / 100;
  const decimals = fraction > 0 ? String(fraction).slice(1) : "";

  return `${rounded < 0 ? "-" : ""}${grouped}${decimals}`;
}

/** Parse a CLI token as a number, tolerating thousands separators. */
export function parseNumber(token: string): number | null {
  const cleaned = token.replace(/,/g, "");
  if (cleaned === "" || !/\d/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}
