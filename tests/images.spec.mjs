import { expect, test } from "@playwright/test";
import { pageURL } from "./pages.mjs";

test("resizing changes both dimensions and preserves the last size for invalid input", async ({ page }) => {
  await page.goto(pageURL("task5.html"));
  const image = page.getByRole("img");
  const width = page.getByLabel("Width in pixels");
  const height = page.getByLabel("Height in pixels");
  await width.fill("240");
  await height.fill("120");
  await height.press("Enter");
  expect(await image.boundingBox()).toMatchObject({ width: 240, height: 120 });
  await expect(page.getByRole("status")).toHaveText("Image resized to 240 by 120 pixels.");
  await width.fill("0");
  await page.getByRole("button", { name: "Resize image" }).click();
  await expect(width).toBeFocused();
  expect(await image.boundingBox()).toMatchObject({ width: 240, height: 120 });
  await width.fill("300");
  await height.fill("1.5");
  await page.getByRole("button", { name: "Resize image" }).click();
  await expect(height).toBeFocused();
  expect(await image.boundingBox()).toMatchObject({ width: 240, height: 120 });
});

test("show, hide and toggle keep the image, status and pressed state in sync", async ({ page }) => {
  await page.goto(pageURL("task20.html"));
  const image = page.locator("#myImg");
  const toggle = page.getByRole("button", { name: "Toggle image visibility" });
  await expect(image).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  for (const [button, visible] of [
    ["Hide", false], ["Hide", false], ["Toggle image visibility", true],
    ["Show", true], ["Toggle image visibility", false], ["Show", true]
  ]) {
    await page.getByRole("button", { name: button, exact: true }).press("Enter");
    if (visible) await expect(image).toBeVisible();
    else await expect(image).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-pressed", String(visible));
    await expect(page.getByRole("status")).toHaveText(visible ? "Image shown." : "Image hidden.");
  }
});
