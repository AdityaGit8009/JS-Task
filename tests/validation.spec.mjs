import { expect, test } from "@playwright/test";
import { pageURL } from "./pages.mjs";

test("PIN validation checks digits, length and the first position", async ({ page }) => {
  await page.goto(pageURL("task18.html"));
  const input = page.getByLabel("PIN code", { exact: true });
  for (const [value, valid] of [
    ["", false], ["012345", false], ["12a456", false], ["12345", false],
    ["1234567", false], ["12 456", false], ["110001", true], [" 560001 ", true]
  ]) {
    await input.fill(value);
    await input.press("Enter");
    await expect(input).toHaveAttribute("aria-invalid", String(!valid));
    await expect(page.getByRole("status")).toContainText(valid ? "Valid PIN code." : "Enter six digits");
  }
});

test("website validation parses the hostname separately from paths, ports and queries", async ({ page }) => {
  await page.goto(pageURL("task19.html"));
  const input = page.getByLabel("Website address");
  for (const [value, valid] of [
    ["", false], ["example.org", true], ["Example.ORG:8080/notes?q=two#part", true],
    ["HTTPS://www.example.co.uk/notes", true], ["https://café.example/", true],
    ["documents/file.pdf", false], ["ftp://example.org", false], ["https://", false],
    ["https://bad..example/", false], ["www. example.org", false], ["reader@example.org", false],
    ["https://example.org:99999", false], ["https:///example.org", false]
  ]) {
    await input.fill(value);
    await input.press("Enter");
    await expect(input, value).toHaveAttribute("aria-invalid", String(!valid));
    await expect(page.getByRole("status"), value).toContainText(
      valid ? "Valid website URL." : value ? "valid domain" : "Please enter a URL."
    );
  }
});

test("résumé checking handles no file, mixed case extensions and misleading suffixes", async ({ page }) => {
  await page.goto(pageURL("task16.html"));
  const input = page.getByLabel("Résumé file");
  const check = page.getByRole("button", { name: "Check file" });
  const status = page.getByRole("status");
  await check.click();
  await expect(status).toHaveText("Please select a file.");
  for (const [name, valid] of [
    ["resume.DOCX", true], ["resume.doc", true], ["resume.PdF", true],
    ["resume.pdf.txt", false], ["pdf", false]
  ]) {
    await input.setInputFiles({ name, mimeType: "application/octet-stream", buffer: Buffer.from("sample") });
    await expect(status).toBeEmpty();
    await check.click();
    await expect(input).toHaveAttribute("aria-invalid", String(!valid));
    await expect(status).toContainText(valid ? name : "Choose a file ending");
  }
});
