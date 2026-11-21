import { expect, test } from "@playwright/test";
import { pageURL } from "./pages.mjs";

test("copy uses the submitted record and preserves text and enrollment zeros", async ({ page }) => {
  await page.goto(pageURL("index.html"));
  const name = page.getByLabel("Name", { exact: true });
  const college = page.getByLabel("College name");
  const copy = page.getByRole("button", { name: "Copy submitted details" });
  await expect(copy).toBeDisabled();

  await name.fill("A <b>Reader</b>");
  await page.getByLabel("Branch").fill("CSE");
  await page.getByLabel("Enrollment number").fill("00123");
  await college.fill("North & South");
  await college.press("Enter");
  const submitted = page.getByRole("region", { name: "Submitted details" });
  const original = ["A <b>Reader</b>", "CSE", "00123", "North & South"];
  await expect(submitted.locator("dd")).toHaveText(original);
  await expect(submitted.locator("b")).toHaveCount(0);

  await name.fill("Revised name");
  await copy.click();
  const copied = page.getByRole("region", { name: "Copied details" });
  await expect(copied.locator("dd")).toHaveText(original);
  await expect(copied.locator("b")).toHaveCount(0);
  await page.getByRole("button", { name: "Submit details" }).click();
  await copy.click();
  await copy.click();
  await expect(copied.locator("dl")).toHaveCount(1);
  await expect(copied.locator("dd").first()).toHaveText("Revised name");
});

test("the student form rejects a whitespace-only name and a nonnumeric enrollment", async ({ page }) => {
  await page.goto(pageURL("index.html"));
  const name = page.getByLabel("Name", { exact: true });
  const roll = page.getByLabel("Enrollment number");
  await name.fill("   ");
  await page.getByLabel("Branch").fill("CSE");
  await roll.fill("42");
  await page.getByLabel("College name").fill("East College");
  await page.getByRole("button", { name: "Submit details" }).click();
  await expect(name).toBeFocused();
  await expect(page.locator("#details")).toBeHidden();
  await name.fill("Student");
  await roll.fill("42A");
  await page.getByRole("button", { name: "Submit details" }).click();
  await expect(roll).toBeFocused();
  await expect(page.locator("#copy")).toBeDisabled();
});

test("the name exercise explains a blank submission and accepts a corrected name on Enter", async ({ page }) => {
  await page.goto(pageURL("task9.html"));
  const name = page.getByLabel("Your name");
  await name.fill("   ");
  await name.press("Enter");
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toBeFocused();
  await expect(page.getByRole("alert")).toBeVisible();
  await name.fill("  Sam  ");
  await name.press("Enter");
  await expect(name).toHaveAttribute("aria-invalid", "false");
  await expect(page.locator("#nameError")).toBeHidden();
  await expect(page.getByRole("status")).toHaveText("Details submitted for Sam.");
});
