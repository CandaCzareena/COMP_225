/**
 * Generate ColtCircle Part 3 labeled screenshots as a Word (.docx) document.
 * Run: node docs/part3/generate-screenshots-docx.mjs
 */
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  BorderStyle,
} from "docx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shotsDir = path.join(__dirname, "screenshots");
const outPath = path.join(__dirname, "ColtCircle-Part3-Screenshots.docx");

/** ~6.3 inches wide at 96 DPI for page fit */
const IMG_WIDTH_PX = 605;
const IMG_MAX_HEIGHT_PX = 720;

const sections = [
  {
    label: "01 · Auth",
    title: "Login",
    desc: "Brand hero + sign-in form. Any school or personal email; opens the authenticated app shell.",
    file: "01-auth-login.png",
  },
  {
    label: "02 · Auth",
    title: "Sign Up",
    desc: "Open registration for students and educators (role picker, name, optional student number/program, email, password).",
    file: "02-auth-signup.png",
  },
  {
    label: "03 · Core",
    title: "Home Feed",
    desc: "Welcome banner, create post (title, body, photo/video), and circle feed. Sidebar: Alerts, Home, Connect, Marketplace, Messages, Profile, Users, Admin.",
    file: "03-home-feed.png",
  },
  {
    label: "04 · Social",
    title: "Connect & Study Hub",
    desc: "Shows real connections from the Student Directory for study partners and tutors.",
    file: "04-connect.png",
  },
  {
    label: "05 · Commerce",
    title: "Student Marketplace",
    desc: "Buy, sell, or trade textbooks/gear with media. “+ Sell Item” starts a listing.",
    file: "05-marketplace.png",
  },
  {
    label: "06 · Messaging",
    title: "Messages",
    desc: "Chat list + conversation pane, media attach, and tutor meeting scheduling (from Users → Message).",
    file: "06-messages.png",
  },
  {
    label: "07 · Account",
    title: "My Profile",
    desc: "Avatar/photo upload, academic info (program, student ID, origin), and personal marketplace listings.",
    file: "07-profile.png",
  },
  {
    label: "08 · Directory",
    title: "Student Directory (Users)",
    desc: "Searchable directory to Connect or Message other students and educators.",
    file: "08-users-directory.png",
  },
  {
    label: "09 · Admin",
    title: "Admin Console",
    desc: "Admin-only overview: Add user form + users table (roles, credentials, Edit/Delete). Marketplace tab manages listings.",
    file: "09-admin-console.png",
  },
  {
    label: "09b · Admin",
    title: "Admin Create User",
    desc: "Admin fills Add user (name, email, password, role/program) and clicks Create user. The new temporary demo user appears in the table.",
    file: "09b-admin-create-user.png",
  },
  {
    label: "09c · Admin",
    title: "Admin Delete User",
    desc: "Admin deletes the temporary demo user (confirm dialog). Table no longer shows that user; the main admin account remains.",
    file: "09c-admin-delete-user.png",
  },
  {
    label: "10 · Alerts",
    title: "Alerts / Notifications",
    desc: "Bell panel for connect, message, post, and meeting notifications; Mark all read.",
    file: "10-alerts-panel.png",
  },
  {
    label: "11 · Responsive",
    title: "Mobile Home Layout",
    desc: "Narrow viewport: compact top nav (Home / Connect / Market / Chats / Profile) and mobile-friendly feed composer.",
    file: "11-mobile-home.png",
  },
];

function pngSize(buf) {
  if (buf[0] !== 0x89 || buf[1] !== 0x50) throw new Error("Not a PNG");
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

function fitImage(naturalW, naturalH) {
  let w = IMG_WIDTH_PX;
  let h = Math.round((naturalH / naturalW) * w);
  if (h > IMG_MAX_HEIGHT_PX) {
    h = IMG_MAX_HEIGHT_PX;
    w = Math.round((naturalW / naturalH) * h);
  }
  return { width: w, height: h };
}

function shotParagraphs(shot, index) {
  const filePath = path.join(shotsDir, shot.file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing screenshot: ${filePath}`);
  }
  const data = fs.readFileSync(filePath);
  const { width: nw, height: nh } = pngSize(data);
  const { width, height } = fitImage(nw, nh);

  const kids = [];
  if (index > 0) {
    kids.push(new Paragraph({ children: [new PageBreak()] }));
  }

  kids.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: shot.label,
          bold: true,
          size: 20,
          color: "0F766E",
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: shot.title,
          bold: true,
          size: 32,
          color: "0F3D3E",
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: shot.desc,
          size: 20,
          color: "5A6F6F",
          font: "Calibri",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new ImageRun({
          type: "png",
          data,
          transformation: { width, height },
          altText: {
            title: shot.title,
            description: shot.desc,
            name: shot.file,
          },
        }),
      ],
    })
  );

  return kids;
}

const titleChildren = [
  new Paragraph({
    spacing: { before: 1200, after: 200 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "COMP229 · Project Part 3",
        size: 22,
        color: "0D9488",
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 200 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "ColtCircle — Part 3 Labeled Screenshots",
        bold: true,
        size: 40,
        color: "0F3D3E",
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 400 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Campus social + marketplace for students and educators",
        size: 22,
        color: "5A6F6F",
        font: "Calibri",
        italics: true,
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 120 },
    alignment: AlignmentType.CENTER,
    border: {
      top: { style: BorderStyle.SINGLE, size: 6, color: "0D9488", space: 12 },
    },
    children: [
      new TextRun({
        text: "Team",
        bold: true,
        size: 20,
        color: "0F3D3E",
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 80 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Czareena Canda",
        size: 22,
        color: "0F3D3E",
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 80 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Nico Ariza",
        size: 22,
        color: "0F3D3E",
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 320 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Saul Ramirez Barragan",
        size: 22,
        color: "0F3D3E",
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 80 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "GitHub",
        bold: true,
        size: 20,
        color: "0F3D3E",
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 200 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "https://github.com/CandaCzareena/COMP_225",
        size: 20,
        color: "0D9488",
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    spacing: { before: 200 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Captured from local UI with live MongoDB Atlas (admin create/delete demonstrated on a temporary demo user).",
        size: 18,
        color: "5A6F6F",
        font: "Calibri",
      }),
    ],
  }),
  new Paragraph({
    children: [new PageBreak()],
  }),
];

const bodyChildren = sections.flatMap((shot, i) => shotParagraphs(shot, i));

const doc = new Document({
  creator: "ColtCircle Team",
  title: "ColtCircle — Part 3 Labeled Screenshots",
  description: "COMP229 Project Part 3 labeled UI screenshots",
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: 720, // 0.5"
            right: 720,
            bottom: 720,
            left: 720,
          },
        },
      },
      children: [...titleChildren, ...bodyChildren],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buffer);
const stat = fs.statSync(outPath);
console.log(`Wrote ${outPath}`);
console.log(`Size: ${stat.size} bytes (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
console.log(`Screenshots embedded: ${sections.length}`);
