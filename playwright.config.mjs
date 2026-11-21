import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    browserName: "chromium",
    channel: process.env.PLAYWRIGHT_CHANNEL
  }
});
