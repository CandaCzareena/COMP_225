import pptxgen from "pptxgenjs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shots = path.join(__dirname, "screenshots");
const logo = path.resolve(__dirname, "../../client/src/assets/logo.png");
const out = path.join(__dirname, "ColtCircle-Part3-Presentation.pptx");
const outAlt = path.join(__dirname, "ColtCircle-Part3-Presentation-v2.pptx");

const TEAL = "0D9488";
const INK = "0F3D3E";
const CORAL = "E07A5F";
const CREAM = "FFF8E7";
const WHITE = "FFFFFF";
const MUTED = "5A6F6F";

function shot(name) {
  const p = path.join(shots, name);
  if (!fs.existsSync(p)) throw new Error(`Missing screenshot: ${p}`);
  return p;
}

const pptx = new pptxgen();
pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
pptx.layout = "WIDE";
pptx.author = "ColtCircle Team";
pptx.title = "ColtCircle — COMP229 Part 3";
pptx.subject = "Project Part 3 Presentation";

// ——— 1. Title ———
{
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: TEAL },
  });
  s.addShape(pptx.shapes.OVAL, {
    x: 9.5, y: 4.2, w: 5, h: 5, fill: { color: CORAL, transparency: 35 },
  });
  if (fs.existsSync(logo)) {
    s.addImage({ path: logo, x: 0.7, y: 0.55, w: 0.85, h: 0.85 });
  }
  s.addText("COMP229 · Project Part 3", {
    x: 1.7, y: 0.75, w: 6, h: 0.35,
    fontSize: 14, color: WHITE, fontFace: "Arial",
  });
  s.addText("ColtCircle", {
    x: 0.7, y: 1.8, w: 7, h: 1,
    fontSize: 54, bold: true, color: WHITE, fontFace: "Arial",
  });
  s.addText("Campus social + marketplace for students and educators", {
    x: 0.7, y: 2.85, w: 7.5, h: 0.5,
    fontSize: 18, color: WHITE, fontFace: "Arial",
  });
  s.addText("Czareena Canda  ·  Nico Ariza  ·  Saul Ramirez Barragan", {
    x: 0.7, y: 6.5, w: 8, h: 0.35,
    fontSize: 14, color: WHITE, fontFace: "Arial",
  });
  s.addImage({
    path: shot("03-home-feed.png"),
    x: 8.2, y: 0.9, w: 4.6, h: 2.7,
    shadow: { type: "outer", color: "000000", blur: 12, opacity: 0.25 },
  });
  s.addImage({
    path: shot("01-auth-login.png"),
    x: 8.6, y: 3.9, w: 4.2, h: 2.45,
    shadow: { type: "outer", color: "000000", blur: 12, opacity: 0.25 },
  });
}

// ——— 2. Roles ———
{
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: CREAM },
  });
  s.addText("Team Roles", {
    x: 0.6, y: 0.35, w: 12, h: 0.55,
    fontSize: 32, bold: true, color: INK, fontFace: "Arial",
  });
  s.addText("Replace gray photo boxes with real mugshots before presenting.", {
    x: 0.6, y: 0.9, w: 12, h: 0.3,
    fontSize: 12, color: MUTED, fontFace: "Arial", italic: true,
  });

  const roles = [
    {
      name: "Czareena Canda",
      role: "Full-stack / Product lead",
      items: [
        "Auth, admin console, notifications",
        "Deploy, CI, tests, Part 3 materials",
        "UI polish & feature integration",
      ],
    },
    {
      name: "Nico Ariza",
      role: "Frontend / Features",
      items: [
        "Marketplace seller listings",
        "Messaging & Connect hub",
        "Frontend progress & UI flows",
      ],
    },
    {
      name: "Saul Ramirez Barragan",
      role: "Backend / Integration",
      items: [
        "MongoDB / API wiring",
        "Home feed ↔ backend",
        "Environment & connection setup",
      ],
    },
  ];

  roles.forEach((r, i) => {
    const x = 0.55 + i * 4.2;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.4, w: 3.95, h: 5.5,
      fill: { color: WHITE },
      shadow: { type: "outer", color: "000000", blur: 8, opacity: 0.1 },
      rectRadius: 0.15,
    });
    s.addShape(pptx.shapes.OVAL, {
      x: x + 1.1, y: 1.7, w: 1.75, h: 1.75,
      fill: { color: "D1D5DB" },
    });
    s.addText("PHOTO", {
      x: x + 1.1, y: 2.35, w: 1.75, h: 0.4,
      fontSize: 12, color: MUTED, align: "center", fontFace: "Arial",
    });
    s.addText(r.name, {
      x: x + 0.2, y: 3.6, w: 3.55, h: 0.4,
      fontSize: 16, bold: true, color: INK, align: "center", fontFace: "Arial",
    });
    s.addText(r.role, {
      x: x + 0.2, y: 4.05, w: 3.55, h: 0.35,
      fontSize: 13, color: TEAL, align: "center", fontFace: "Arial",
    });
    s.addText(r.items.map((t) => ({ text: t, options: { breakLine: true } })), {
      x: x + 0.35, y: 4.55, w: 3.3, h: 2,
      fontSize: 13, color: INK, fontFace: "Arial",
      bullet: true, paraSpaceAfter: 6,
    });
  });
}

// ——— 3. Overview ———
{
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: WHITE },
  });
  s.addText("Web Application Overview", {
    x: 0.6, y: 0.35, w: 12, h: 0.55,
    fontSize: 32, bold: true, color: INK, fontFace: "Arial",
  });
  s.addText(
    "ColtCircle is a MERN campus app: students and educators post tips, trade gear, message tutors, connect for study, and admins manage the platform.",
    {
      x: 0.6, y: 1.0, w: 7.2, h: 1.1,
      fontSize: 16, color: MUTED, fontFace: "Arial",
    }
  );
  const bullets = [
    "Stack: React (Vite) · Express · MongoDB Atlas · JWT auth",
    "Roles: Student · Educator · Admin",
    "Core: Home posts + media · Marketplace CRUD · Messages + meetings",
    "Social: Users directory · Connect hub · Alerts",
    "Admin: create / edit / delete users + marketplace listings",
    "Ops: Multer uploads · Jest unit tests · Cypress smoke · GitHub Actions CI",
  ];
  s.addText(bullets.map((t) => ({ text: t, options: { breakLine: true } })), {
    x: 0.6, y: 2.2, w: 7.2, h: 4,
    fontSize: 16, color: INK, fontFace: "Arial",
    bullet: true, paraSpaceAfter: 10,
  });
  s.addImage({
    path: shot("05-marketplace.png"),
    x: 8.1, y: 1.2, w: 4.7, h: 2.75,
  });
  s.addImage({
    path: shot("06-messages.png"),
    x: 8.1, y: 4.15, w: 4.7, h: 2.75,
  });
}

// ——— 4. Planning ———
{
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: CREAM },
  });
  s.addText("Planning", {
    x: 0.6, y: 0.35, w: 12, h: 0.55,
    fontSize: 32, bold: true, color: INK, fontFace: "Arial",
  });

  const cols = [
    {
      title: "Shipped",
      color: TEAL,
      items: [
        "Open signup (any students/educators)",
        "Home / Marketplace / Messages CRUD",
        "Connect + Notifications",
        "Admin console",
        "Mobile layout",
        "Tests + CI workflow",
      ],
    },
    {
      title: "Cut / deferred",
      color: CORAL,
      items: [
        "Centennial-email-only gate",
        "Heavy real-time sockets polish",
        "Native mobile apps",
        "Payments / escrow",
      ],
    },
    {
      title: "Challenges",
      color: INK,
      items: [
        "Atlas DNS / network access",
        "Render build (Vite deps)",
        "JWT + secured mutating routes",
        "Keeping UI usable while DB is down",
      ],
    },
  ];

  cols.forEach((c, i) => {
    const x = 0.55 + i * 4.2;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.2, w: 3.95, h: 5.6,
      fill: { color: WHITE },
      rectRadius: 0.12,
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x, y: 1.2, w: 3.95, h: 0.55, fill: { color: c.color },
    });
    s.addText(c.title, {
      x, y: 1.28, w: 3.95, h: 0.4,
      fontSize: 18, bold: true, color: WHITE, align: "center", fontFace: "Arial",
    });
    s.addText(c.items.map((t) => ({ text: t, options: { breakLine: true } })), {
      x: x + 0.3, y: 2.0, w: 3.4, h: 4.5,
      fontSize: 15, color: INK, fontFace: "Arial",
      bullet: true, paraSpaceAfter: 8,
    });
  });
}

// ——— 5. Instructions ———
{
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: WHITE },
  });
  s.addText("How to Use the Site", {
    x: 0.6, y: 0.35, w: 12, h: 0.55,
    fontSize: 32, bold: true, color: INK, fontFace: "Arial",
  });
  const steps = [
    ["1", "Sign up / Login", "Create an account as Student or Educator, then sign in."],
    ["2", "Home", "Share tips with title, text, and optional photo/video."],
    ["3", "Users → Connect / Message", "Find people, connect, or open a chat."],
    ["4", "Marketplace", "Browse listings or click + Sell Item to post gear."],
    ["5", "Messages", "Chat, attach media, schedule tutor meetings."],
    ["6", "Admin", "Create users, edit roles, Delete demo users; manage listings."],
  ];
  steps.forEach((row, i) => {
    const col = i % 3;
    const rowIdx = Math.floor(i / 3);
    const x = 0.55 + col * 4.2;
    const y = 1.15 + rowIdx * 2.9;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 3.95, h: 2.6,
      fill: { color: CREAM },
      rectRadius: 0.12,
    });
    s.addShape(pptx.shapes.OVAL, {
      x: x + 0.25, y: y + 0.3, w: 0.55, h: 0.55,
      fill: { color: TEAL },
    });
    s.addText(row[0], {
      x: x + 0.25, y: y + 0.38, w: 0.55, h: 0.4,
      fontSize: 16, bold: true, color: WHITE, align: "center", fontFace: "Arial",
    });
    s.addText(row[1], {
      x: x + 0.95, y: y + 0.35, w: 2.7, h: 0.45,
      fontSize: 16, bold: true, color: INK, fontFace: "Arial",
    });
    s.addText(row[2], {
      x: x + 0.3, y: y + 1.1, w: 3.35, h: 1.2,
      fontSize: 14, color: MUTED, fontFace: "Arial",
    });
  });
}

// ——— 6. Site Demo title ———
{
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: TEAL },
  });
  s.addText("Site Demo", {
    x: 0.8, y: 2.4, w: 11.5, h: 1,
    fontSize: 54, bold: true, color: WHITE, align: "center", fontFace: "Arial",
  });
  s.addText("Live walkthrough ≤ 10 minutes", {
    x: 0.8, y: 3.5, w: 11.5, h: 0.5,
    fontSize: 22, color: WHITE, align: "center", fontFace: "Arial",
  });
  s.addText(
    "Auth → Home → Users/Connect → Marketplace → Messages → Alerts → Admin → Mobile",
    {
      x: 1.2, y: 4.4, w: 10.9, h: 0.6,
      fontSize: 15, color: WHITE, align: "center", fontFace: "Arial",
    }
  );
}

// ——— 7–12. Demo gallery slides ———
const gallery = [
  ["Login & Sign Up", "01-auth-login.png", "02-auth-signup.png", "Open auth for any email; student or educator roles."],
  ["Home Feed", "03-home-feed.png", "11-mobile-home.png", "Desktop feed + mobile layout with Share to Circle."],
  ["Connect & Users", "04-connect.png", "08-users-directory.png", "Directory search → Connect or Message."],
  ["Marketplace", "05-marketplace.png", "07-profile.png", "Listings + profile marketplace section."],
  ["Messages & Alerts", "06-messages.png", "10-alerts-panel.png", "Chats, media, meetings; notification bell."],
  ["Admin Console", "09-admin-console.png", "09b-admin-create-user.png", "Admin overview + Create user (new row in table)."],
  ["Admin Delete User", "09b-admin-create-user.png", "09c-admin-delete-user.png", "Create demo user, then Delete (confirm). Main admin account kept."],
];

gallery.forEach(([title, a, b, caption]) => {
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: WHITE },
  });
  s.addText(title, {
    x: 0.5, y: 0.25, w: 12, h: 0.5,
    fontSize: 26, bold: true, color: INK, fontFace: "Arial",
  });
  s.addText(caption, {
    x: 0.5, y: 0.75, w: 12, h: 0.35,
    fontSize: 13, color: MUTED, fontFace: "Arial",
  });
  s.addImage({ path: shot(a), x: 0.4, y: 1.25, w: 6.1, h: 5.7 });
  s.addImage({ path: shot(b), x: 6.8, y: 1.25, w: 6.1, h: 5.7 });
});

// ——— Retrospective ———
{
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: CREAM },
  });
  s.addText("Team Retrospective", {
    x: 0.6, y: 0.35, w: 12, h: 0.55,
    fontSize: 32, bold: true, color: INK, fontFace: "Arial",
  });
  const retro = [
    ["What went well", TEAL, [
      "Clear MERN split and reusable page shell",
      "Feature set covers social + marketplace",
      "CI + unit/E2E smoke tests landed late but useful",
    ]],
    ["What was hard", CORAL, [
      "Cloud DB networking (Atlas DNS / IP allowlist)",
      "Keeping Render builds reliable with Vite",
      "Balancing demo UI when APIs time out",
    ]],
    ["What we learned", INK, [
      "Secure routes early; don’t ship open CRUD",
      "Deploy env checks matter as much as features",
      "Screenshot/demo evidence needs a stable DB",
    ]],
  ];
  retro.forEach((r, i) => {
    const x = 0.55 + i * 4.2;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.2, w: 3.95, h: 5.5,
      fill: { color: WHITE },
      rectRadius: 0.12,
    });
    s.addText(r[0], {
      x: x + 0.25, y: 1.45, w: 3.45, h: 0.5,
      fontSize: 18, bold: true, color: r[1], fontFace: "Arial",
    });
    s.addText(r[2].map((t) => ({ text: t, options: { breakLine: true } })), {
      x: x + 0.3, y: 2.2, w: 3.4, h: 4,
      fontSize: 15, color: INK, fontFace: "Arial",
      bullet: true, paraSpaceAfter: 12,
    });
  });
}

// ——— Future ———
{
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: WHITE },
  });
  s.addText("Future Possibilities", {
    x: 0.6, y: 0.35, w: 12, h: 0.55,
    fontSize: 32, bold: true, color: INK, fontFace: "Arial",
  });
  const futures = [
    ["Real-time chat", "WebSockets / Socket.IO for live typing and presence"],
    ["Safer marketplace", "Verified sellers, reports, optional escrow"],
    ["Study tools", "Shared calendars, group study rooms, file folders"],
    ["Mobile app", "React Native or PWA install + push notifications"],
    ["Moderation", "Content filters and richer admin analytics"],
    ["Campus integrations", "SSO / LMS hooks for programs and courses"],
  ];
  futures.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.55 + col * 4.2;
    const y = 1.2 + row * 2.8;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 3.95, h: 2.5,
      fill: { color: CREAM },
      rectRadius: 0.12,
    });
    s.addText(f[0], {
      x: x + 0.3, y: y + 0.4, w: 3.35, h: 0.5,
      fontSize: 18, bold: true, color: TEAL, fontFace: "Arial",
    });
    s.addText(f[1], {
      x: x + 0.3, y: y + 1.05, w: 3.35, h: 1.1,
      fontSize: 14, color: INK, fontFace: "Arial",
    });
  });
}

// ——— Closing ———
{
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: TEAL },
  });
  if (fs.existsSync(logo)) {
    s.addImage({ path: logo, x: 6.15, y: 1.4, w: 1.0, h: 1.0 });
  }
  s.addText("Thank you", {
    x: 0.8, y: 2.7, w: 11.7, h: 0.8,
    fontSize: 44, bold: true, color: WHITE, align: "center", fontFace: "Arial",
  });
  s.addText("Questions?", {
    x: 0.8, y: 3.55, w: 11.7, h: 0.5,
    fontSize: 22, color: WHITE, align: "center", fontFace: "Arial",
  });
  s.addText(
    "GitHub: https://github.com/CandaCzareena/COMP_225\nScreenshots: docs/part3/ColtCircle-Part3-Screenshots.html",
    {
      x: 1.5, y: 5.5, w: 10.3, h: 0.9,
      fontSize: 14, color: WHITE, align: "center", fontFace: "Arial",
    }
  );
}

try {
  await pptx.writeFile({ fileName: out });
  console.log("Wrote", out);
} catch (err) {
  if (err && (err.code === "EBUSY" || /EBUSY|locked/i.test(String(err.message)))) {
    await pptx.writeFile({ fileName: outAlt });
    console.log("Primary PPTX locked; wrote", outAlt);
  } else {
    throw err;
  }
}
