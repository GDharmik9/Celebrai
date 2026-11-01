/**
 * Parses an incremental streaming JSON string buffer into a partial object.
 * Used for optimistic UI rendering while Gemini streams JSON back.
 */
export function parsePartialJson<T>(raw: string): Partial<T> | null {
  // Try full parse first
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Attempt to close unclosed JSON structures for partial display
    const candidates = attemptJsonRepair(raw);
    for (const candidate of candidates) {
      try {
        return JSON.parse(candidate) as Partial<T>;
      } catch {
        // Continue trying
      }
    }
    return null;
  }
}

function attemptJsonRepair(raw: string): string[] {
  const results: string[] = [];

  // Try closing braces/brackets
  let attempt = raw.trim();
  const openBraces = (attempt.match(/\{/g) ?? []).length;
  const closeBraces = (attempt.match(/\}/g) ?? []).length;
  const openBrackets = (attempt.match(/\[/g) ?? []).length;
  const closeBrackets = (attempt.match(/\]/g) ?? []).length;

  attempt += "]".repeat(Math.max(0, openBrackets - closeBrackets));
  attempt += "}".repeat(Math.max(0, openBraces - closeBraces));
  results.push(attempt);

  // Try stripping trailing partial token
  const lastComma = raw.lastIndexOf(",");
  if (lastComma > 0) {
    const truncated = raw.slice(0, lastComma);
    const tb = (truncated.match(/\{/g) ?? []).length - (truncated.match(/\}/g) ?? []).length;
    const tBk = (truncated.match(/\[/g) ?? []).length - (truncated.match(/\]/g) ?? []).length;
    results.push(
      truncated +
        "]".repeat(Math.max(0, tBk)) +
        "}".repeat(Math.max(0, tb))
    );
  }

  return results;
}

/**
 * Formats currency values in Indian locale
 */
export function formatINR(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a date string for display
 */
export function formatDate(
  dateStr: string,
  opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  }
): string {
  return new Date(dateStr).toLocaleDateString("en-IN", opts);
}
