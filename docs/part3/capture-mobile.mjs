import { chromium } from "playwright";
import dotenv from "dotenv";

dotenv.config();

const out = "docs/part3/screenshots/11-mobile-home.png";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle", timeout: 60000 });
await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle", timeout: 60000 });
await page.locator('input[placeholder="you@school.edu"]').fill(process.env.ADMIN_EMAIL);
await page.locator('input[type="password"]').fill(process.env.ADMIN_PASSWORD);
await page.getByRole("button", { name: "Login" }).click();
await page.waitForSelector("text=Welcome back", { timeout: 30000 });
await page.waitForTimeout(1500);

const body = await page.locator("body").innerText();
const bad = ["jwt malformed", "buffering timed out", "blogs.find()", "UnauthorizedError"];
const hits = bad.filter((b) => body.toLowerCase().includes(b.toLowerCase()));
console.log("errors", hits);

await page.screenshot({ path: out, fullPage: true });
console.log("saved", out);
await browser.close();
