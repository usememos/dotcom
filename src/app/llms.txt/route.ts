import { buildLlmsIndex } from "@/features/ai-discovery/lib/llms-content";
import { getLlmsIndexInput } from "@/features/ai-discovery/lib/llms-sources";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const body = buildLlmsIndex(getLlmsIndexInput());

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
