# Project Part 2 — Completion Checklist (COMP229)

GitHub: https://github.com/CandaCzareena/COMP_225

## Done in code (ready for grading demo)

- [x] Home + logo + site name
- [x] Sign up / Sign in (open to all students & educators)
- [x] Authenticated navbar (Users, My Profile, Sign out + other views)
- [x] React ↔ Express ↔ MongoDB Atlas
- [x] CRUD: posts (Home), marketplace items, users (profile + admin)
- [x] Messages + tutor meeting scheduling
- [x] Notifications (connect / message / post / meeting)
- [x] Media uploads (posts, marketplace, messages)
- [x] Admin console
- [x] Mobile-friendly layout
- [x] Secured mutating API routes (auth / admin where needed)
- [x] Jest unit tests (`npm test`) — `server/tests/blog.test.js`
- [x] Cypress E2E smoke tests (`cypress/e2e/smoke.cy.js`)
- [x] GitHub Actions CI (`.github/workflows/ci.yml`)
- [x] Deploy config (`render.yaml`, `DEPLOY.md`)

## Team must still finish (cannot complete from code alone)

### Deploy
- [ ] Confirm live URL works (Render) — test signup/login/CRUD
- [ ] Paste live URL into submission: `https://YOUR-SERVICE.onrender.com`
- [ ] Atlas Network Access includes `0.0.0.0/0` (Active)

### Testing evidence
- [ ] Screenshot of Jest unit test results (`npm test`)
- [ ] Run Cypress with app running:
  1. Terminal A: `npm run dev`
  2. Terminal B: `npm install --prefix cypress` then `npx cypress run` (from repo root with config)
  - Or: `cd cypress && npm install && npx cypress open`
- [ ] Save Cypress recording/video + screenshot for submission

### CI/CD demo
- [ ] Screenshot of site **before** a content tweak
- [ ] Create branch → edit one page paragraph → merge to `main`
- [ ] Wait for Render redeploy → screenshot **after**
- [ ] Optional: screenshot of GitHub Actions green check

### Documents
- [ ] EDD v3 PDF (team name, logo, wireframes, screenshots)
- [ ] Product Backlog / Task Board PDF (Trello/Jira)
- [ ] Part A video (5–10 min) + 2 slides (if still required for Part 2)
- [ ] Zip of project files (not .rar) for submission box

## Quick commands

```powershell
# Unit tests
npm test

# Local app
$env:NODE_OPTIONS='--use-system-ca'; npm run dev

# Cypress (with app already running on :5173)
npm install --prefix ./cypress
npx cypress run --config-file cypress.config.cjs
```
