import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "screenshots");
fs.mkdirSync(outDir, { recursive: true });

const BASE = process.env.SHOT_BASE || "http://127.0.0.1:5173";
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Missing ADMIN_EMAIL / ADMIN_PASSWORD in .env");
  process.exit(1);
}

async function shot(page, name) {
  const file = path.join(outDir, name);
  await page.waitForTimeout(600);
  await page.screenshot({ path: file, fullPage: true });
  console.log("saved", name);
}

async function assertNoBadErrors(page, label) {
  const body = await page.locator("body").innerText();
  const bad = [
    "jwt malformed",
    "buffering timed out",
    "blogs.find()",
    "ECONNREFUSED",
    "UnauthorizedError",
  ];
  const hits = bad.filter((b) => body.toLowerCase().includes(b.toLowerCase()));
  if (hits.length) {
    console.warn(`[warn] ${label} still shows: ${hits.join(", ")}`);
    return false;
  }
  console.log(`[ok] ${label} no known error banners`);
  return true;
}

async function clickNav(page, name) {
  // Prefer desktop sidebar text
  const item = page.locator(".nav-links, aside, nav").getByText(name, { exact: true }).first();
  if (await item.count()) {
    await item.click();
    return;
  }
  await page.getByRole("listitem").filter({ hasText: name }).first().click();
}

const browser = await chromium.launch({
  channel: "msedge",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();

try {
  // Clear any stale session
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });

  // 01 Login
  await page.waitForSelector('input[placeholder="you@school.edu"], input[type="email"], form', {
    timeout: 20000,
  });
  await shot(page, "01-auth-login.png");

  // 02 Signup
  await page.locator("span").filter({ hasText: "Register here" }).click();
  await page.waitForSelector('button:has-text("Sign Up")', { timeout: 10000 });
  await shot(page, "02-auth-signup.png");

  // Back to login and sign in for real
  await page.locator("span").filter({ hasText: "Login here" }).click();
  await page.waitForSelector('button:has-text("Login")', { timeout: 10000 });

  const emailInput = page.locator('input[placeholder="you@school.edu"]').first();
  const passInput = page.locator('input[type="password"]').first();
  await emailInput.fill(email);
  await passInput.fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForSelector("text=Welcome back", { timeout: 30000 });
  await page.waitForTimeout(1500);
  await assertNoBadErrors(page, "home-after-login");
  await shot(page, "03-home-feed.png");

  // Seed a post if feed looks empty
  const noPosts = await page.getByText("No posts yet").count();
  if (noPosts) {
    await page.getByPlaceholder("Post title...").fill("Part 3 demo tip");
    await page
      .getByPlaceholder(/Share an assignment tip/)
      .fill("Welcome to ColtCircle — tips, marketplace, and messages in one place.");
    await page.getByRole("button", { name: "Share to Circle" }).click();
    await page.waitForTimeout(2000);
    await shot(page, "03-home-feed.png");
  }

  await clickNav(page, "Connect");
  await page.waitForTimeout(1200);
  await assertNoBadErrors(page, "connect");
  await shot(page, "04-connect.png");

  await clickNav(page, "Marketplace");
  await page.waitForTimeout(1200);
  await assertNoBadErrors(page, "marketplace");
  // Seed marketplace if empty
  const loadingOrEmpty =
    (await page.getByText("Loading marketplace").count()) ||
    (await page.getByText(/No listings|nothing for sale/i).count());
  if (loadingOrEmpty) {
    const sell = page.getByRole("button", { name: /Sell Item/i });
    if (await sell.count()) {
      await sell.click();
      await page.waitForTimeout(500);
      // fill common fields if present
      const title = page.locator('input[name="title"], input[placeholder*="Title" i]').first();
      if (await title.count()) {
        await title.fill("Demo Textbook — Calculus");
      }
      const price = page.locator('input[name="price"], input[placeholder*="Price" i]').first();
      if (await price.count()) await price.fill("25");
      const desc = page.locator("textarea").first();
      if (await desc.count()) await desc.fill("Lightly used textbook for Part 3 demo.");
      const submit = page.getByRole("button", { name: /Post|Save|Create|List|Sell/i }).last();
      if (await submit.count()) {
        await submit.click();
        await page.waitForTimeout(1500);
      }
    }
  }
  await shot(page, "05-marketplace.png");

  await clickNav(page, "Messages");
  await page.waitForTimeout(1200);
  await assertNoBadErrors(page, "messages");
  await shot(page, "06-messages.png");

  await clickNav(page, "My Profile");
  await page.waitForTimeout(1200);
  await assertNoBadErrors(page, "profile");
  await shot(page, "07-profile.png");

  await clickNav(page, "Users");
  await page.waitForTimeout(1500);
  await assertNoBadErrors(page, "users");
  await shot(page, "08-users-directory.png");

  await clickNav(page, "Admin");
  await page.waitForTimeout(1500);
  await assertNoBadErrors(page, "admin");
  await shot(page, "09-admin-console.png");

  // Alerts panel
  const alerts = page.getByRole("button", { name: /Notifications|Alerts/i }).first();
  if (await alerts.count()) {
    await alerts.click();
    await page.waitForTimeout(800);
  } else {
    await clickNav(page, "Alerts");
    await page.waitForTimeout(800);
  }
  await assertNoBadErrors(page, "alerts");
  await shot(page, "10-alerts-panel.png");

  // Mobile home — use mobile nav (desktop sidebar is hidden at this width)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  const mobileHome = page.locator(".mobile-nav, .bottom-nav, header, .top-nav").getByText("Home", { exact: true }).first();
  if (await mobileHome.count()) {
    await mobileHome.click({ force: true });
  } else {
    // Fall back: reload app shell on home
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  }
  await page.waitForTimeout(1200);
  await assertNoBadErrors(page, "mobile-home");
  await shot(page, "11-mobile-home.png");

  console.log("DONE all screenshots in", outDir);
} catch (err) {
  console.error("CAPTURE FAILED:", err.message);
  await page.screenshot({ path: path.join(outDir, "_error.png"), fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
}
