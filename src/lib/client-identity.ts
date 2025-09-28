const HEADER_CANDIDATES = [
  "cf-connecting-ip",
  "true-client-ip",
  "x-client-ip",
  "x-forwarded-for",
  "x-real-ip",
  "fly-client-ip",
  "x-forwarded",
];

function extractFromForwarded(value: string): string | null {
  const forwarded = value.split(";");
  for (const part of forwarded) {
    const trimmed = part.trim();
    if (trimmed.toLowerCase().startsWith("for=")) {
      const ipPart = trimmed.substring(4).replace(/^"|"$/g, "");
      if (ipPart) {
        const ip = ipPart.split(",")[0]?.trim();
        if (ip) {
          return ip;
        }
      }
    }
  }
  return null;
}

function extractPrimaryAddress(value: string): string | null {
  if (!value) return null;
  const primary = value.split(",")[0]?.trim();
  return primary || null;
}

export function getClientIdentifier(request: Request): string {
  for (const header of HEADER_CANDIDATES) {
    const value = request.headers.get(header);
    if (!value) continue;
    const lower = header.toLowerCase();
    if (lower === "x-forwarded" || lower === "forwarded") {
      const forwarded = extractFromForwarded(value);
      if (forwarded) return forwarded;
      continue;
    }
    if (lower === "x-forwarded-for") {
      const forwardedFor = extractPrimaryAddress(value);
      if (forwardedFor) return forwardedFor;
      continue;
    }
    return value.trim();
  }

  const forwardedHeader = request.headers.get("forwarded");
  if (forwardedHeader) {
    const forwarded = extractFromForwarded(forwardedHeader);
    if (forwarded) return forwarded;
  }

  const userAgent = request.headers.get("user-agent") || "anonymous";
  const acceptLanguage = request.headers.get("accept-language") || "generic";
  return `${userAgent.slice(0, 60)}|${acceptLanguage.slice(0, 40)}`;
}
