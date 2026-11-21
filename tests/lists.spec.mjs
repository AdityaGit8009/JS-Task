import { expect, test } from "@playwright/test";
import { pageURL } from "./pages.mjs";

test("country options come from the list and the selected entry follows the picker", async ({ page }) => {
  await page.goto(pageURL("task6.html"));
  const source = page.locator("#list li");
  const picker = page.getByLabel("Country");
  await expect(picker.locator("option")).toHaveText(await source.allTextContents());
  await expect(page.locator("#list [aria-current]")).toHaveText("India");
  await picker.selectOption("Canada");
  await expect(page.locator("#list [aria-current]")).toHaveText("Canada");
});

test("copying all options twice keeps one list and tracks its selected name", async ({ page }) => {
  await page.goto(pageURL("task10.html"));
  const picker = page.getByLabel("Name", { exact: true });
  const show = page.getByRole("button", { name: "Show all names" });
  const items = page.locator("#output li");
  await expect(items).toHaveCount(0);
  await picker.selectOption("Ravi");
  await show.click();
  await show.click();
  await expect(items).toHaveText(["Aditya", "Sanjay", "Abhishek", "Ravi"]);
  await expect(page.locator("#output [aria-current]")).toHaveText("Ravi");
  await picker.selectOption("Sanjay");
  await expect(page.locator("#output [aria-current]")).toHaveText("Sanjay");
});

test("row coloring uses data positions and preserves table headers", async ({ page }) => {
  await page.goto(pageURL("Task7.html"));
  const picker = page.getByLabel("Rows to color");
  const coloredIds = page.locator("tbody tr.colored td:first-child");
  await expect(page.getByRole("columnheader")).toHaveText(["ID", "Name", "Branch"]);
  await expect(coloredIds).toHaveText(["1", "2", "3"]);
  await picker.selectOption("even");
  await expect(coloredIds).toHaveText(["2"]);
  await picker.selectOption("odd");
  await expect(coloredIds).toHaveText(["1", "3"]);
  await expect(page.getByRole("status")).toHaveText("2 of 3 data rows colored.");
});

test("odd and even highlights can be disabled and restored independently", async ({ page }) => {
  await page.goto(pageURL("task14.html"));
  const odd = page.getByRole("checkbox", { name: "Odd", exact: true });
  const even = page.getByRole("checkbox", { name: "Even", exact: true });
  const status = page.getByRole("status");
  await expect(status).toContainText("6 of 6");
  await odd.uncheck();
  await expect(page.locator("#myList .even")).toHaveText(["Item Two", "Item Four", "Item Six"]);
  await expect(page.locator("#myList .odd")).toHaveCount(0);
  await even.uncheck();
  await expect(status).toContainText("0 of 6");
  await odd.check();
  await expect(page.locator("#myList .odd")).toHaveText(["Item One", "Item Three", "Item Five"]);
  await expect(status).toContainText("3 of 6");
});
