import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "screenshots");
fs.mkdirSync(outDir, { recursive: true });

const BASE = "http://127.0.0.1:5173";
const DEMO_EMAIL = `demo.delete.${Date.now()}@coltcircle-demo.test`;
const DEMO_NAME = "Demo Delete User";
const DEMO_PASS = "DemoPass123!";

async function shot(page, name) {
  const file = path.join(outDir, name);
  await page.waitForTimeout(700);
  await page.screenshot({ path: file, fullPage: true });
  console.log("saved", name);
}

function hasBadErrors(text) {
  const bad = ["jwt malformed", "buffering timed out", "blogs.find()", "UnauthorizedError", "ECONNREFUSED"];
  return bad.filter((b) => text.toLowerCase().includes(b.toLowerCase()));
}

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// Accept confirm() for delete
page.on("dialog", async (dialog) => {
  console.log("dialog:", dialog.type(), dialog.message());
  await dialog.accept();
});

try {
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });

  await page.locator('input[placeholder="you@school.edu"]').fill(process.env.ADMIN_EMAIL);
  await page.locator('input[type="password"]').fill(process.env.ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForSelector("text=Welcome back", { timeout: 30000 });
  await page.waitForTimeout(1000);

  // Go Admin
  await page.locator(".nav-links, aside, nav").getByText("Admin", { exact: true }).first().click();
  await page.waitForSelector("text=Admin Console", { timeout: 15000 });
  await page.waitForSelector("text=Add user", { timeout: 15000 });
  await page.waitForTimeout(1200);

  let body = await page.locator("body").innerText();
  let hits = hasBadErrors(body);
  if (hits.length) throw new Error("Admin page errors: " + hits.join(", "));
  await shot(page, "09-admin-console.png");

  // Fill create-user form
  await page.getByPlaceholder("Full name").fill(DEMO_NAME);
  await page.getByPlaceholder("Email").fill(DEMO_EMAIL);
  await page.getByPlaceholder("Password", { exact: true }).fill(DEMO_PASS);
  await page.getByPlaceholder("Student number").fill("309999999");
  await page.getByPlaceholder("Program / department").fill("Demo Program");
  await page.getByPlaceholder("Origin").fill("Demo");
  await page.getByRole("button", { name: "Create user" }).click();

  // Wait until new user appears in table
  await page.waitForSelector(`text=${DEMO_EMAIL}`, { timeout: 20000 });
  await page.waitForTimeout(800);
  body = await page.locator("body").innerText();
  hits = hasBadErrors(body);
  if (hits.length) throw new Error("After create errors: " + hits.join(", "));
  if (!body.includes(DEMO_NAME) && !body.includes(DEMO_EMAIL)) {
    throw new Error("Created demo user not visible in table");
  }
  await shot(page, "09b-admin-create-user.png");
  console.log("created", DEMO_EMAIL);

  // Delete the demo user only — click Delete on the row containing DEMO_EMAIL
  const row = page.locator("tr, .admin-table tr, table tr").filter({ hasText: DEMO_EMAIL }).first();
  if (!(await row.count())) {
    // fallback: any container with email
    const block = page.locator(`text=${DEMO_EMAIL}`).locator("xpath=ancestor::*[self::tr or contains(@class,'row') or contains(@class,'card')][1]");
    await block.getByRole("button", { name: /Delete/i }).click();
  } else {
    await row.getByRole("button", { name: /Delete/i }).click();
  }

  // Wait until email gone
  await page.waitForFunction(
    (email) => !document.body.innerText.includes(email),
    DEMO_EMAIL,
    { timeout: 20000 }
  );
  await page.waitForTimeout(800);

  // Ensure admin still present
  body = await page.locator("body").innerText();
  hits = hasBadErrors(body);
  if (hits.length) throw new Error("After delete errors: " + hits.join(", "));
  if (body.includes(DEMO_EMAIL)) throw new Error("Demo user still present after delete");
  if (!body.toLowerCase().includes("candaczareena@coltcircle.com") && !body.includes("Czareena")) {
    console.warn("warn: admin row not clearly visible, but continuing");
  }
  await shot(page, "09c-admin-delete-user.png");
  console.log("deleted", DEMO_EMAIL);
  console.log("DONE admin create/delete shots");
} catch (err) {
  console.error("FAILED:", err.message);
  await page.screenshot({ path: path.join(outDir, "_admin-error.png"), fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
}
