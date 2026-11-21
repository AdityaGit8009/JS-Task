import { expect, test } from "@playwright/test";
import { pageURL } from "./pages.mjs";

test("the table replaces all ten products and clears them when the input changes", async ({ page }) => {
  await page.goto(pageURL("task1.html"));
  const number = page.getByLabel("Number");
  const rows = page.locator("#result li");
  await number.fill("-2.5");
  await number.press("Enter");
  await expect(rows).toHaveText(Array.from({ length: 10 }, (_, i) =>
    `-2.5 × ${i + 1} = ${-2.5 * (i + 1)}`
  ));
  await number.fill("0");
  await expect(rows).toHaveCount(0);
  await number.press("Enter");
  await expect(rows).toHaveCount(10);
  await expect(rows.last()).toHaveText("0 × 10 = 0");
  await number.fill("1e308");
  await number.press("Enter");
  await expect(rows).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("smaller number");
});

test("all calculator operations use decimals and both zero divisors give feedback", async ({ page }) => {
  await page.goto(pageURL("task2.html"));
  const first = page.getByLabel("First number");
  const second = page.getByLabel("Second number");
  const result = page.locator("#result");
  await first.fill("7.5");
  await second.fill("2");
  for (const [operation, answer] of [
    ["Addition", "9.5"], ["Subtraction", "5.5"], ["Multiplication", "15"],
    ["Division", "3.75"], ["Modulus", "1.5"]
  ]) {
    await page.getByRole("button", { name: operation }).click();
    await expect(result).toHaveText(answer);
  }
  await second.fill("0");
  for (const operation of ["Division", "Modulus"]) {
    await page.getByRole("button", { name: operation }).click();
    await expect(result).toContainText("divisor");
  }
  await second.fill("");
  await page.getByRole("button", { name: "Addition" }).click();
  await expect(second).toBeFocused();
  await expect(result).toBeEmpty();
});

test("height comparison covers fractional winners, ties and zero", async ({ page }) => {
  await page.goto(pageURL("task3.html"));
  const heights = page.getByRole("spinbutton");
  const result = page.getByRole("status");
  await heights.nth(0).fill("161.1");
  await heights.nth(1).fill("161.8");
  await heights.nth(2).fill("161.6");
  await heights.nth(2).press("Enter");
  await expect(result).toHaveText("Second person is tallest at 161.8 cm.");
  await heights.nth(0).fill("161.8");
  await heights.nth(0).press("Enter");
  await expect(result).toHaveText("First person and Second person tie for tallest at 161.8 cm.");
  await heights.nth(2).fill("161.8");
  await heights.nth(2).press("Enter");
  await expect(result).toContainText("First person, Second person, and Third person");
  await heights.nth(1).fill("0");
  await heights.nth(1).press("Enter");
  await expect(result).toContainText("greater than zero");
});
