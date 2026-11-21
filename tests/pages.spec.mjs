import { expect, test } from "@playwright/test";
import { exercises, pageURL } from "./pages.mjs";

for (const file of ["index.html", ...exercises]) {
  test(`${file} loads its scripts and images`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => errors.push(request.url()));

    await page.goto(pageURL(file));
    await expect(page).toHaveTitle(/\S/);
    const imagesLoaded = await page.locator("img").evaluateAll((images) =>
      images.every((image) => image.complete && image.naturalWidth > 0)
    );
    expect(imagesLoaded).toBe(true);
    expect(errors).toEqual([]);
  });
}
