import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ROOT } from "../helpers/fs.js";

describe("vercel.app must not be indexed", () => {
  it("redirects drhoney.vercel.app to drhoney.xyz", () => {
    const cfg = JSON.parse(readFileSync(resolve(ROOT, "vercel.json"), "utf8"));
    const hit = (cfg.redirects || []).some(
      (r) =>
        Array.isArray(r.has) &&
        r.has.some((h) => h.value === "drhoney.vercel.app") &&
        String(r.destination).includes("drhoney.xyz") &&
        r.permanent === true
    );
    expect(hit).toBe(true);
  });

  it("sets X-Robots-Tag noindex on drhoney.vercel.app", () => {
    const cfg = JSON.parse(readFileSync(resolve(ROOT, "vercel.json"), "utf8"));
    const hit = (cfg.headers || []).some(
      (h) =>
        Array.isArray(h.has) &&
        h.has.some((x) => x.value === "drhoney.vercel.app") &&
        (h.headers || []).some(
          (hdr) =>
            hdr.key === "X-Robots-Tag" &&
            String(hdr.value).toLowerCase().includes("noindex")
        )
    );
    expect(hit).toBe(true);
  });

  it("has middleware that blocks any *.vercel.app host", () => {
    const src = readFileSync(resolve(ROOT, "middleware.js"), "utf8");
    expect(src).toContain(".vercel.app");
    expect(src).toContain("drhoney.xyz");
    expect(src).toContain("noindex");
  });
});
