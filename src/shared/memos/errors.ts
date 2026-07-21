import { LATEST_SUPPORTED_VERSION, MINIMUM_SUPPORTED_VERSION } from "./supported-versions";

/** The distinguishable ways a direct browser→instance call can fail. */
export type InstanceErrorKind =
  | "mixed-content"
  | "cors"
  | "unreachable"
  | "unauthorized"
  | "timeout"
  | "bad-response"
  | "unsupported-version";

export type InstanceErrorDetail = {
  kind: InstanceErrorKind;
  /** Short headline. */
  title: string;
  /** One sentence on why it happened. */
  why: string;
  /** Ordered, actionable remediation steps. */
  howToFix: string[];
};

/** For unsupported-version: which side of the supported range the instance is on. */
export type VersionIssue = "below-minimum" | "above-latest";

/** Thrown by the instance client; carries the classified kind. */
export class InstanceError extends Error {
  readonly kind: InstanceErrorKind;
  /** The instance version in play, when known (used for unsupported-version copy). */
  readonly instanceVersion?: string;
  readonly versionIssue?: VersionIssue;
  constructor(kind: InstanceErrorKind, instanceVersion?: string, versionIssue?: VersionIssue) {
    super(kind);
    this.name = "InstanceError";
    this.kind = kind;
    this.instanceVersion = instanceVersion;
    this.versionIssue = versionIssue;
  }
}

export type DescribeContext = {
  /** This site's origin, for CORS remediation copy. Defaults to "this site". */
  origin?: string;
  instanceVersion?: string;
  versionIssue?: VersionIssue;
};

/** Maps an error kind to user-facing copy (title / why / how to fix). */
export function describeInstanceError(kind: InstanceErrorKind, context: DescribeContext = {}): InstanceErrorDetail {
  const origin = context.origin ?? "this site";
  switch (kind) {
    case "mixed-content":
      return {
        kind,
        title: "Your instance uses http://",
        why: "This site is served over https, and browsers block https pages from calling http:// addresses.",
        howToFix: [
          "Serve your Memos instance over https (e.g. behind a TLS reverse proxy).",
          "Update the instance URL to the https:// address, then try again.",
        ],
      };
    case "cors":
      return {
        kind,
        title: "Your instance blocked this site (CORS)",
        why: `Your Memos server is reachable, but it didn't allow ${origin} to read the response from the browser.`,
        howToFix: [
          `Allow the origin ${origin} on your Memos server or its reverse proxy.`,
          `nginx example: add_header 'Access-Control-Allow-Origin' '${origin}' always; and allow the GET/OPTIONS methods and the Authorization header.`,
          "Reload your proxy, then click Test connection again.",
        ],
      };
    case "unreachable":
      return {
        kind,
        title: "Couldn't reach your instance",
        why: "The request never got a response from the server.",
        howToFix: ["Check the instance URL is correct and the server is online.", "Open the URL in a new browser tab to confirm it loads."],
      };
    case "unauthorized":
      return {
        kind,
        title: "Access token rejected",
        why: "The instance returned 401/403 — the token is invalid or expired.",
        howToFix: ["Open Memos → Settings → Access Tokens and create a new token.", "Paste the new token here and save."],
      };
    case "timeout":
      return {
        kind,
        title: "Your instance timed out",
        why: "The server didn't respond within 8 seconds.",
        howToFix: ["Check the server is online and not overloaded.", "Try again in a moment."],
      };
    case "unsupported-version": {
      const version = context.instanceVersion ?? "your version";
      if (context.versionIssue === "below-minimum") {
        return {
          kind,
          title: "Unsupported Memos version",
          why: `Your instance reports ${version}. Connections require Memos ${MINIMUM_SUPPORTED_VERSION} or newer.`,
          howToFix: [
            `Update the instance to Memos ${MINIMUM_SUPPORTED_VERSION} or newer.`,
            "Test the connection again after the update finishes.",
          ],
        };
      }
      return {
        kind,
        title: "Unsupported Memos version",
        why: `Your instance reports ${version}, which is newer than this site knows how to read.`,
        howToFix: [
          `This site supports Memos up to ${LATEST_SUPPORTED_VERSION}.`,
          "Stats may be unavailable until the site is updated for your version.",
        ],
      };
    }
    default:
      return {
        kind: "bad-response",
        title: "Unexpected response",
        why: "The instance returned something that isn't a valid API response — possibly a redirect or a login page.",
        howToFix: [
          "Enter the root address where Memos opens, without /setting, /api, or another path.",
          "If a proxy or sign-in gateway intercepts API requests, allow direct access to the Memos API.",
          "If the server redirects (http→https or apex→www), use the final URL.",
        ],
      };
  }
}
