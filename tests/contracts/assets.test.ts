import { describe, expect, it } from "vitest";
import { EXPECTED } from "../fixtures/expected.js";
import { existsRepo } from "../helpers/fs.js";

describe("T1 — critical assets exist", () => {
  const assets = [
    EXPECTED.productImage,
    EXPECTED.ogImage,
    EXPECTED.favicon48,
    EXPECTED.video,
    EXPECTED.poster,
    "favicon.ico",
    "favicon-32.png",
    "apple-touch-icon.png",
  ];

  for (const file of assets) {
    it(`has ${file}`, () => {
      expect(existsRepo(file), `missing asset: ${file}`).toBe(true);
    });
  }
});
