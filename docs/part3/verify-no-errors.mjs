import { chromium } from "playwright";
import dotenv from "dotenv";

dotenv.config();

const BASE = "http://127.0.0.1:5173";
const BAD = [
  "UnauthorizedError",
  "jwt malformed",
  "buffering timed out",
  "blogs.find()",
  "Could not retrieve user",
  "ECONNREFUSED",
  "MongoServerError",
  "Operation `",
];

async function bodyText(page) {
  return page.locator("body").innerText();
}

function findBad(text) {
  return BAD.filter((b) => text.toLowerCase().includes(b.toLowerCase()));
}

async function clickNav(page, name) {
  await page.locator(".nav-links, aside, nav").getByText(name, { exact: true }).first().click();
}

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const results = [];

try {
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(500);
  results.push({ page: "login", bad: findBad(await bodyText(page)) });

  await page.locator("span").filter({ hasText: "Register here" }).click();
  await page.waitForSelector('button:has-text("Sign Up")');
  await page.waitForTimeout(400);
  results.push({ page: "signup", bad: findBad(await bodyText(page)) });

  await page.locator("span").filter({ hasText: "Login here" }).click();
  await page.locator('input[placeholder="you@school.edu"]').fill(process.env.ADMIN_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForSelector("text=Welcome back", { timeout: 30000 });
  await page.waitForTimeout(1500);
  results.push({ page: "home", bad: findBad(await bodyText(page)) });

  for (const name of ["Connect", "Marketplace", "Messages", "My Profile", "Users", "Admin"]) {
    await clickNav(page, name);
    await page.waitForTimeout(1500);
    // wait out loading labels
    for (let i = 0; i < 10; i++) {
      const t = await bodyText(page);
      if (!/Loading (posts|marketplace|users|admin|connections|messages|profile)/i.test(t)) break;
      await page.waitForTimeout(500);
    }
    results.push({ page: name.toLowerCase(), bad: findBad(await bodyText(page)) });
  }

  // alerts open
  const bell = page.getByRole("button", { name: /Notifications/i }).first();
  if (await bell.count()) {
    await bell.click();
    await page.waitForTimeout(800);
  }
  results.push({ page: "alerts", bad: findBad(await bodyText(page)) });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  results.push({ page: "mobile-home", bad: findBad(await bodyText(page)) });

  let failed = false;
  for (const r of results) {
    if (r.bad.length) {
      failed = true;
      console.log("FAIL", r.page, r.bad.join(", "));
    } else {
      console.log("OK", r.page);
    }
  }
  if (failed) process.exitCode = 1;
  else console.log("ALL_PAGES_CLEAN");
} catch (e) {
  console.error("VERIFY_FAILED", e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
