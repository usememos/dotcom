export type RouteAuthDeps = {
  isClerkConfigured: () => boolean;
  getUserId: () => Promise<string | null>;
};

export async function requireUserId(deps: RouteAuthDeps): Promise<{ userId: string } | { response: Response }> {
  if (!deps.isClerkConfigured()) {
    return { response: Response.json({ error: "Authentication is not configured." }, { status: 503 }) };
  }
  const userId = await deps.getUserId();
  if (!userId) {
    return { response: Response.json({ error: "Sign in to manage Memos settings." }, { status: 401 }) };
  }
  return { userId };
}
