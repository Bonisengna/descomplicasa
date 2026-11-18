import { readFile } from "node:fs/promises";
import path from "node:path";
import { contentRoot, getArticle } from "@/lib/editorial-store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(_request: Request, { params }: { params: Promise<{slug: string}> }) {
  const { slug } = await params;
  const article = await getArticle(slug); const root = contentRoot();
  if (!article || !root) return new Response(null, {status:404});
  const bytes = await readFile(path.join(root, slug, "image"));
  return new Response(bytes, {headers:{"Content-Type":bytes[0]===137 ? "image/png":"image/jpeg", "X-Content-Type-Options":"nosniff", "Cache-Control":"public, max-age=86400", "Content-Security-Policy":"default-src 'none'; sandbox"}});
}
