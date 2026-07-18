import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export function readRepo(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

export function existsRepo(rel: string): boolean {
  return existsSync(resolve(ROOT, rel));
}

/** Map cleanUrl path (no trailing slash) to on-disk HTML file. */
export function urlToFile(loc: string): string {
  const u = new URL(loc);
  let path = u.pathname.replace(/\/$/, "") || "/";
  if (path === "/") return "index.html";
  if (path.endsWith(".html")) return path.slice(1);
  // /ru → ru/index.html ; /thank-you → thank-you.html ; /guides/foo → guides/foo.html
  const bare = path.slice(1);
  if (existsRepo(`${bare}/index.html`)) return `${bare}/index.html`;
  if (existsRepo(`${bare}.html`)) return `${bare}.html`;
  return `${bare}.html`;
}
