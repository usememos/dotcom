/** Formats a Date as its UTC calendar day, "YYYY-MM-DD". */
export function toUtcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
