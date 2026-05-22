import { defineConfig } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL || "http://127.0.0.1:5173";
const useHostedBeta = Boolean(process.env.E2E_BASE_URL);

export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  use: {
    baseURL,
    channel: "chrome",
    trace: "retain-on-failure",
  },
  webServer: useHostedBeta
    ? undefined
    : {
        command: "npm run dev -- --port 5173",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120000,
      },
});
