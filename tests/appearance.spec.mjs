import { expect, test } from "@playwright/test";
import { pageURL } from "./pages.mjs";

test("previous and next swap the panel text and announce the resulting order", async ({ page }) => {
  await page.goto(pageURL("task4.html"));
  const panels = page.locator(".panels > div");
  await expect(panels).toHaveText(["This is div 1", "This is div 2"]);
  await page.getByRole("button", { name: "Next" }).press("Enter");
  await expect(panels).toHaveText(["This is div 2", "This is div 1"]);
  await expect(page.getByRole("status")).toContainText("The first panel reads “This is div 2”");
  await page.getByRole("button", { name: "Previous" }).press("Space");
  await expect(panels).toHaveText(["This is div 1", "This is div 2"]);
});

test("the native color input updates the swatch and the displayed hex value", async ({ page }) => {
  await page.goto(pageURL("task8.html"));
  await expect(page.locator("#myDiv")).toHaveCSS("background-color", "rgb(0, 128, 0)");
  const picker = page.getByLabel("Swatch color");
  await picker.evaluate((input) => {
    input.value = "#123abc";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(page.locator("#myDiv")).toHaveCSS("background-color", "rgb(18, 58, 188)");
  await expect(page.getByRole("status")).toHaveText("#123ABC");
});

test("keyboard color selection updates the name and contrast of the preview", async ({ page }) => {
  await page.goto(pageURL("task15.html"));
  const picker = page.getByRole("listbox", { name: "Colors" });
  const preview = page.getByRole("status");
  await expect(preview).toHaveText("Red");
  await picker.press("End");
  await expect(preview).toHaveText("Orange");
  await expect(preview).toHaveCSS("color", "rgb(0, 0, 0)");
  await picker.selectOption("blue");
  await expect(preview).toHaveText("Blue");
  await expect(preview).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("tabbing through the textbox updates its focus cue and preserves the entered value", async ({ page }) => {
  await page.goto(pageURL("task17.html"));
  const input = page.getByLabel("Sample text");
  const status = page.getByRole("status");
  await page.keyboard.press("Tab");
  await expect(input).toBeFocused();
  await expect(input).toHaveClass(/highlight/);
  await expect(status).toHaveText("Field is focused.");
  await input.fill("Keep this text");
  await input.press("Tab");
  await expect(input).not.toHaveClass(/highlight/);
  await expect(status).toHaveText("Field is unfocused.");
  await expect(input).toHaveValue("Keep this text");
});
