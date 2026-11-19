import { createHash, timingSafeEqual, randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, writeFile, rename, rm } from "node:fs/promises";
import path from "node:path";

export type EditorialArticle = {
  slug: string; title: string; description: string; lead: string;
  publishedAt: string;
  sections: { id: string; title: string; paragraphs: string[]; bullets?: string[] }[];
  sources: { label: string; url: string }[];
  image: { src: string; alt: string; credit: string; license: string; sourceUrl: string; sha256: string };
};
export class EditorialError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function validSlug(value: unknown): value is string {
  return typeof value === "string" && value.length <= 100 && slugPattern.test(value);
}
function text(value: unknown, max: number): asserts value is string {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new EditorialError("Campo de texto inválido.");
}
function https(value: unknown) {
  text(value, 2048);
  let url: URL;
  try { url = new URL(value); } catch { throw new EditorialError("URL inválida."); }
  if (url.protocol !== "https:" || url.username || url.password) throw new EditorialError("URL deve usar HTTPS sem credenciais.");
}
export function validateArticle(value: unknown): asserts value is EditorialArticle {
  if (!value || typeof value !== "object") throw new EditorialError("Artigo ausente.");
  const a = value as EditorialArticle;
  if (!validSlug(a.slug)) throw new EditorialError("Slug inválido.");
  text(a.title, 180); text(a.description, 320); text(a.lead, 2400);
  if (!/^\d{4}-\d{2}-\d{2}T/.test(a.publishedAt) || !Number.isFinite(Date.parse(a.publishedAt))) throw new EditorialError("Data inválida.");
  if (!Array.isArray(a.sections) || !a.sections.length || a.sections.length > 16) throw new EditorialError("Seções inválidas.");
  const ids = new Set();
  for (const s of a.sections) {
    if (!s || !validSlug(s.id) || ids.has(s.id)) throw new EditorialError("Identificador de seção inválido.");
    ids.add(s.id); text(s.title, 200);
    if (!Array.isArray(s.paragraphs) || !s.paragraphs.length || s.paragraphs.length > 16) throw new EditorialError("Parágrafos inválidos.");
    s.paragraphs.forEach(p => text(p, 4000));
    if (s.bullets !== undefined) {
      if (!Array.isArray(s.bullets) || s.bullets.length > 16) throw new EditorialError("Lista inválida.");
      s.bullets.forEach(p => text(p, 1000));
    }
  }
  if (!Array.isArray(a.sources) || !a.sources.length || a.sources.length > 16) throw new EditorialError("Fontes ausentes.");
  for (const s of a.sources) { if (!s) throw new EditorialError("Fonte inválida."); text(s.label, 200); https(s.url); }
  if (!a.image || a.image.src !== `/api/editorial/media/${a.slug}`) throw new EditorialError("Caminho da imagem inválido.");
  text(a.image.alt, 350); text(a.image.credit, 500); https(a.image.sourceUrl);
  if (!["CC0", "Public domain", "CC BY 4.0", "CC BY-SA 4.0", "CC BY 3.0", "CC BY-SA 3.0", "CC BY 2.0", "CC BY-SA 2.0"].includes(a.image.license)) throw new EditorialError("Licença não permitida.");
  if (!/^[a-f0-9]{64}$/.test(a.image.sha256)) throw new EditorialError("Hash da imagem inválido.");
}
export const sha256 = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
export function authorize(header: string | null, secret: string | undefined) {
  if (!secret || secret.length < 32) throw new EditorialError("Publicação desabilitada.", 503);
  const expected = Buffer.from(`Bearer ${secret}`); const supplied = Buffer.from(header ?? "");
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) throw new EditorialError("Não autorizado.", 401);
}
export function contentRoot() { return process.env.EDITORIAL_CONTENT_DIR; }
export async function getArticle(slug: string, root = contentRoot()): Promise<EditorialArticle | null> {
  if (!root || !validSlug(slug)) return null;
  try { const value: unknown = JSON.parse(await readFile(path.join(root, slug, "article.json"), "utf8")); validateArticle(value); return value; }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; }
}
export async function listArticles(root = contentRoot()) {
  if (!root) return [];
  let names: string[];
  try { names = await readdir(root); } catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return []; throw error; }
  const articles = await Promise.all(names.filter(validSlug).map(name => getArticle(name, root)));
  return articles.filter((a): a is EditorialArticle => a !== null).sort((a,b) => b.publishedAt.localeCompare(a.publishedAt));
}
export async function publishArticle(payload: unknown, root = contentRoot(), allowed = process.env.EDITORIAL_APPROVER_IDS, now = Date.now()) {
  if (!root || !path.isAbsolute(root) || !allowed) throw new EditorialError("Publicação desabilitada.", 503);
  const p = payload as { article: EditorialArticle; approval: { versionHash: string; approvedBy: string; approvedAt: string }; imageBase64: string; imageMimeType: string };
  if (!p) throw new EditorialError("Payload ausente.");
  validateArticle(p.article);
  const hash = sha256(JSON.stringify(p.article));
  const approval = p.approval;
  if (!approval || approval.versionHash !== hash || !allowed.split(",").map(v=>v.trim()).includes(String(approval.approvedBy))) throw new EditorialError("Aprovação inválida.", 403);
  const approvedAt = Date.parse(approval.approvedAt);
  if (!Number.isFinite(approvedAt) || approvedAt > now + 60000 || now - approvedAt > 86400000) throw new EditorialError("Aprovação expirada.", 403);
  if (typeof p.imageBase64 !== "string" || p.imageBase64.length > 7_000_000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(p.imageBase64)) throw new EditorialError("Imagem inválida.");
  const image = Buffer.from(p.imageBase64, "base64");
  if (image.length < 32 || image.length > 5_000_000 || sha256(image) !== p.article.image.sha256) throw new EditorialError("Imagem não corresponde à revisão.");
  const jpeg = image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff;
  const png = image.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (!((jpeg && p.imageMimeType === "image/jpeg") || (png && p.imageMimeType === "image/png"))) throw new EditorialError("Formato de imagem não permitido.");
  const target = path.join(root, p.article.slug);
  const existing = await getArticle(p.article.slug, root);
  if (existing) {
    if (sha256(JSON.stringify(existing)) !== hash) throw new EditorialError("Slug já publicado com outra revisão.", 409);
    return { slug: existing.slug, versionHash: hash, duplicate: true };
  }
  await mkdir(root, { recursive: true });
  const staging = path.join(root, `.pending-${randomUUID()}`);
  await mkdir(staging);
  try {
    await writeFile(path.join(staging, "image"), image);
    await writeFile(path.join(staging, "article.json"), JSON.stringify(p.article));
    await writeFile(path.join(staging, "audit.json"), JSON.stringify({ approval, versionHash: hash, imageMimeType: p.imageMimeType, storedAt: new Date(now).toISOString() }));
    try { await rename(staging, target); }
    catch (error) {
      if (!["EEXIST", "ENOTEMPTY", "EPERM"].includes((error as NodeJS.ErrnoException).code ?? "")) throw error;
      const concurrent = await getArticle(p.article.slug, root);
      if (!concurrent || sha256(JSON.stringify(concurrent)) !== hash) throw new EditorialError("Conflito de publicação.", 409);
      return { slug: concurrent.slug, versionHash: hash, duplicate: true };
    }
  } finally { await rm(staging, { recursive: true, force: true }); }
  return { slug: p.article.slug, versionHash: hash, duplicate: false };
}
