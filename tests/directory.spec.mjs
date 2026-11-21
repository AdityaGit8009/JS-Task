import { readdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { exercises, pageURL } from "./pages.mjs";

test("the directory uses each real filename in order and matches the page headings", async ({ page }) => {
  await page.goto(pageURL("index.html"));
  const directory = page.getByRole("navigation", { name: "Exercise directory" });
  const links = directory.getByRole("link");
  const names = await links.allTextContents();
  const targets = await links.evaluateAll((items) => items.map((item) => item.getAttribute("href")));
  expect(targets).toEqual(exercises);

  const filenames = readdirSync(new URL("../", import.meta.url));
  for (const [index, filename] of targets.entries()) {
    expect(filenames).toContain(filename);
    await page.goto(pageURL(filename));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(names[index]);
    await expect(page.getByRole("link", { name: "Back to exercise directory" }))
      .toHaveAttribute("href", "index.html#exercises");
  }

  await page.getByRole("link", { name: "Back to exercise directory" }).click();
  await expect(page).toHaveURL(pageURL("index.html#exercises"));
  await expect(directory).toBeFocused();
});

test("the student form and every exercise fit a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const file of ["index.html", ...exercises]) {
    await page.goto(pageURL(file));
    const fitsViewport = await page.evaluate(() =>
      document.documentElement.scrollWidth <= document.documentElement.clientWidth
    );
    expect(fitsViewport, file).toBe(true);
  }
});
