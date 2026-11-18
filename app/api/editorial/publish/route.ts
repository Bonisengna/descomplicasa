import { authorize, EditorialError, publishArticle } from "@/lib/editorial-store";
import { absoluteUrl } from "@/lib/site";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    authorize(request.headers.get("authorization"), process.env.EDITORIAL_PUBLISH_TOKEN);
    if (!request.headers.get("content-type")?.startsWith("application/json")) return Response.json({ error: "Use JSON." }, { status: 415 });
    const reader = request.body?.getReader();
    if (!reader) throw new EditorialError("Corpo ausente.");
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const chunk = await reader.read(); if (chunk.done) break;
      size += chunk.value.length;
      if (size > 8_000_000) { await reader.cancel(); throw new EditorialError("Arquivo excede o limite.", 413); }
      chunks.push(chunk.value);
    }
    let payload: unknown;
    try { payload = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new EditorialError("JSON inválido."); }
    const result = await publishArticle(payload);
    return Response.json({ ...result, publicUrl: absoluteUrl(`/blog/${result.slug}`) }, { status: result.duplicate ? 200 : 201 });
  } catch (error) {
    return Response.json({ error: error instanceof EditorialError ? error.message : "Não foi possível publicar." }, { status: error instanceof EditorialError ? error.status : 500 });
  }
}
