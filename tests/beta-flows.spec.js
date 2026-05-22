import { expect, test } from "@playwright/test";

async function signUp(page, email, teamName = "Beta XI") {
  await page.goto("/");
  await page.getByPlaceholder("you@email.com").fill(email);
  await page.getByPlaceholder("Create a prototype password").fill("password123");
  await page.locator(".auth-card").getByRole("textbox").last().fill(teamName);
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page.getByRole("heading", { name: "Your Leagues" })).toBeVisible();
}

test("beta league flow gates pages, queues pre-draft picks, and supports live-mode testing", async ({ browser, page }) => {
  const stamp = Date.now();
  await signUp(page, `creator-${stamp}@draft.local`, "Creator XI");

  await expect(page.getByRole("button", { name: "Draft", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Stats", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Settings", exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "Create", exact: true }).click();
  await expect(page.locator(".help-tip").first()).toHaveAttribute("data-tip", /Snake uses turn order/);
  await expect(page.getByText("Auction budget")).toHaveCount(0);
  await page.locator(".create-form").getByRole("button", { name: "Create League" }).click();

  await expect(page.getByText("Pre-draft is open")).toBeVisible();
  await page.getByLabel("Queue pre-draft pick").first().click();
  await expect(page.locator(".draft-side").getByText("Auto Pick List")).toBeVisible();
  await expect(page.locator(".draft-side .queue-item")).toHaveCount(1);

  const inviteUrl = await page.locator(".invite-banner input").inputValue();
  expect(inviteUrl).toContain("join=");
  expect(inviteUrl).toContain("league=");

  const joinerContext = await browser.newContext();
  const joiner = await joinerContext.newPage();
  await signUp(joiner, `joiner-${stamp}@draft.local`, "Joiner XI");
  await joiner.goto(inviteUrl);
  await expect(joiner.getByRole("heading", { name: "League of Champions" }).first()).toBeVisible();
  await expect(joiner.getByRole("button", { name: "Settings", exact: true })).toHaveCount(0);
  await expect(joiner.getByRole("button", { name: "Start Draft" })).toHaveCount(0);
  await joinerContext.close();

  await page.getByRole("button", { name: "Start Draft" }).click();
  await expect(page.getByRole("button", { name: "Force Pick" })).toBeVisible();
  await page.getByRole("button", { name: "Force Pick" }).click();
  await expect(page.locator(".draft-side .queue-item")).toHaveCount(0);
  await expect(page.locator(".draft-side").getByText("1/15 selected")).toBeVisible();

  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByRole("heading", { name: "Commissioner Tools" })).toBeVisible();
  await page.getByRole("button", { name: "Start World Cup / Test" }).click();
  await expect(page.getByRole("heading", { name: "Stats" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Draft", exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("button", { name: "Reopen Draft Room" }).click();
  await expect(page.getByRole("status").getByText("Draft room reopened for beta testing.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Draft", exact: true })).toBeVisible();
});
