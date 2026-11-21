import { expect, test } from "@playwright/test";
import { pageURL } from "./pages.mjs";

test("building a menu resets and refocuses the picker after each addition", async ({ page }) => {
  await page.goto(pageURL("task11.html"));
  const picker = page.getByLabel("Menu item", { exact: true });
  const add = page.getByRole("button", { name: "Add item" });
  const preview = page.getByRole("list", { name: "Menu preview" });
  await add.click();
  await expect(preview.getByRole("listitem")).toHaveCount(0);
  for (const name of ["Home", "Contact"]) {
    await picker.selectOption(name);
    await add.press("Enter");
    await expect(picker).toHaveValue("");
    await expect(picker).toBeFocused();
  }
  await expect(preview.getByRole("listitem")).toHaveText(["Home", "Contact"]);
});

test("names open with Enter or Space and close on Escape or leaving the control", async ({ page }) => {
  await page.goto(pageURL("task12.html"));
  const trigger = page.getByRole("button", { name: "Names" });
  const list = page.locator("#sub1");
  await page.keyboard.press("Tab");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(list.getByRole("listitem")).toHaveCount(5);
  await page.keyboard.press("Escape");
  await expect(list).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Space");
  await expect(list).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(list).toBeHidden();
  await expect(page.getByRole("link")).toBeFocused();
  await trigger.hover();
  await expect(list).toBeVisible();
  await page.getByRole("heading").hover();
  await expect(list).toBeHidden();
});

test.describe("touch interaction", () => {
  test.use({ hasTouch: true });

  test("the names stay open after a tap and close after an outside tap", async ({ page }) => {
    await page.goto(pageURL("task12.html"));
    const trigger = page.getByRole("button", { name: "Names" });
    await trigger.tap();
    await expect(page.locator("#sub1")).toBeVisible();
    await page.getByRole("heading").tap();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#sub1")).toBeHidden();
  });
});

test("dropdown edits support each insertion point, empty state and restoration", async ({ page }) => {
  await page.goto(pageURL("task13.html"));
  const input = page.getByLabel("New item");
  const options = page.locator("#dd option");
  await input.fill("Three");
  await input.press("Enter");
  await input.fill("Zero");
  await page.getByRole("button", { name: "Add before first" }).click();
  await input.fill("Middle");
  await page.getByRole("button", { name: "Add after first" }).click();
  await expect(options).toHaveText(["Zero", "Middle", "One", "Two", "Three"]);
  await input.fill("  ");
  await input.press("Enter");
  await expect(options).toHaveCount(5);
  expect(await input.evaluate((element) => element.validity.customError)).toBe(true);

  await page.getByRole("button", { name: "Empty all items" }).click();
  await expect(options).toHaveCount(0);
  await input.fill("Only item");
  await page.getByRole("button", { name: "Add after first" }).click();
  await expect(options).toHaveText(["Only item"]);
  await page.getByRole("button", { name: "Remove dropdown" }).click();
  await expect(page.locator("#dd")).toHaveCount(0);
  await expect(input).toBeDisabled();
  await page.getByRole("button", { name: "Restore dropdown" }).click();
  await expect(input).toBeEnabled();
  await expect(options).toHaveText(["Only item"]);
});
