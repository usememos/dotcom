import { buildLlmsFull } from "@/features/ai-discovery/lib/llms-content";
import { getAllContentPages } from "@/features/ai-discovery/lib/llms-sources";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const body = buildLlmsFull(await getAllContentPages());

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
