import { expect, test } from "@playwright/test";

test.describe("homepage smoke", () => {
  test("loads EN, switches AR/RU, keeps Stripe buy href", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#tagline")).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute("lang", "en");

    const buy = page.locator("#buy-jar");
    await expect(buy).toHaveAttribute("href", /buy\.stripe\.com/);

    await page.getByRole("button", { name: "AR" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("#tagline")).not.toHaveText(/Based in Amman/);

    await page.getByRole("button", { name: "RU" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("#tagline")).toContainText(/Doctor Honey|мёд|Аммане/i);

    await expect(buy).toHaveAttribute("href", /buy\.stripe\.com/);
    await expect(page.locator("#products")).toHaveAttribute(
      "href",
      /buy\.stripe\.com/
    );
  });

  test("thank-you page is reachable", async ({ page }) => {
    await page.goto("/thank-you");
    await expect(page.getByRole("heading", { name: /Thank you/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      /wa\.me\/962777226349/
    );
  });
});
