# PROJECT TITLE

**LoadLift — The Mental-Load Operating System for Moms**

**Course:** COMP311 | Team Project Proposal  
**Date:** September 14, 2026

### Team Members
- Czareena Angela Florence D. Canda — Student No. 30137383
- Saul Ramirez Barragan — Student No. 301527002

---

## A. Executive Summary

LoadLift is a mobile-first web application that reduces the invisible “mental load” carried by mothers—remembering school forms, appointments, pickups, household logistics, and family health details. Unlike generic to-do lists or parenting trackers, LoadLift treats unpaid cognitive labor as a first-class problem: it captures scattered family responsibilities, redistributes them fairly across partners and trusted caregivers, and automates school/admin paperwork into actionable shared tasks.

The product targets busy moms (primary users), co-parents/partners, and optional caregivers (grandparents, babysitters). For COMP311, the project emphasizes clear specifications, early defect prevention, and a testable quality plan—aligned with the course focus on software testing and quality assurance.

---

## B. Business Objectives

### Business Need / Opportunity / Objectives

Many mothers act as the unpaid “project manager” of the household. Even in dual-parent homes, moms disproportionately track deadlines, coordinate childcare, decode school communications, and hold health/history knowledge. Existing apps solve fragments of this problem (calendars, chore charts, baby trackers) but rarely address cognitive-load redistribution or school-admin overload as a connected system.

**Business vision:** Make family coordination fair, visible, and low-friction so moms regain time and mental bandwidth without becoming the default manager of every detail.

**Business objectives (measurable):**
- Reduce average weekly “admin minutes” spent by the primary caregiver by **30%** within 8 weeks of active use.
- Increase shared task ownership: at least **40%** of family tasks claimed/completed by non-primary caregivers within 4 weeks.
- Achieve **70%** of scanned school documents successfully converted into dated tasks with reminders.
- Reach **150** active family accounts in the pilot semester and sustain a **4.5+/5** usefulness rating from mom users.

### Product Description (Solution)

LoadLift is a shared family OS with mom-first design. The primary caregiver (or any adult) can inbox family “mental notes,” digitize school paperwork, set protected personal time, and invite a trusted village for pickup/sick-day coverage. Partners see the same workload board, so fairness becomes measurable—not assumed.

**How it meets business objectives:**
- **Solution description:** React + Express + MongoDB web app with auth, family spaces, task boards, document capture, notifications, and caregiver sharing modes.
- **Benefits:** less burnout for moms, fewer missed school deadlines, clearer co-parent accountability, safer handoffs to caregivers, stronger differentiation vs. generic family organizers.
- **Stakeholder success criteria:** moms report lower mental load; partners complete redistributed tasks; school deadlines are missed less often; caregivers access only the info they need.

### Unique differentiators

Features that make LoadLift distinct from generic parenting / family apps:

1. **Mental-Load Inbox → Fairness Board** — voice/text “brain dumps” auto-classified into tasks, then scored for cognitive weight (not just time) so redistribution is fair.
2. **SchoolPaper Decoder** — photo/PDF of newsletters & permission slips → extracted dates, fees, and “what to bring,” pushed into the shared calendar/task list.
3. **MicroMe Time Guard** — finds real 10–25 minute free windows and auto-protects them with quiet notifications + kid-safe activity suggestions for that exact window.
4. **Village Swap Network** — verified trusted-circle exchange for pickups and sick-day coverage with reputation and optional ID verification.
5. **Care Mode Profiles** — one-tap limited access for babysitters/grandparents (allergies, pickup code, tonight’s routine) without exposing full family data.
6. **ReturnShift Planner** — structured back-to-work ramp for moms (backup childcare tiers, pump/meeting map, partner chore contracts, manager conversation scripts).
7. **KidHealth Timeline** — unified vaccines/symptoms/meds history exportable for clinic visits and shareable in Care Mode.
8. **Conflict-Light Co-Parent Thread** — structured decisions (schedule/expense/approval) instead of unbounded chat arguments; exportable records if needed.

### Deliverables

**Includes:**
- Project proposal, product backlog, and high-level wireframes.
- Working LoadLift MVP (auth, family space, mental-load inbox, shared task board, SchoolPaper Decoder v1, notifications).
- Test plan and executed test evidence (unit + E2E) aligned with COMP311 QA practices.
- User documentation (mom quick-start + partner/caregiver guide) and demo presentation.

**Excludes:**
- Native iOS/Android store apps (responsive web only for MVP).
- Full medical diagnosis / clinical advice engine.
- Paid marketplace for professional childcare staffing.
- Hardware devices, on-premise servers, or legacy database migration.

---

## C. Project Description

### Scope

**Includes:**
- User registration/login and role-aware family membership (Mom/Primary, Partner, Caregiver).
- Mental-Load Inbox with classification into tasks and Fairness Board redistribution.
- SchoolPaper Decoder (manual upload + structured extraction of due dates/items).
- Shared calendar/reminders and in-app notifications.
- Care Mode share links/profiles for temporary caregivers.
- MicroMe Time Guard (basic availability detection from calendar/tasks).
- Admin/moderation basics for Village Swap pilot (invite-only trusted circle).
- Automated tests for core flows and a documented bug-reporting process.

**Does not include:**
- AI medical diagnosis or emergency response dispatch.
- Public open social network / dating-style discovery.
- Full accounting/tax software for household finances.
- Integration with every school portal vendor in v1 (manual upload first).
- Multi-language localization beyond English in the MVP.

### Completion Criteria
- MVP deployed to a staging/production URL accessible to the instructor.
- Core user journeys demoable end-to-end: sign up → create family → brain-dump tasks → redistribute → decode a school form → notify partner → share Care Mode.
- Test suite run with recorded results; critical defects resolved or documented with severity.
- Proposal, backlog, and final demo materials submitted on schedule.

### Measures of Project Success
- **Functional:** 100% of MVP scope features above are implemented and demoable.
- **Quality:** critical/blocker defects = 0 at demo; high defects documented with fix plan; automated tests cover auth + task CRUD + document-to-task happy path.
- **Usability:** 5 pilot moms can complete the primary journey without facilitator help in under 10 minutes.
- **Business proxy metrics in pilot:** ≥30% of tasks completed by non-primary members; ≥70% of uploaded school docs produce at least one dated reminder.
- **Course alignment:** clear specifications exist before coding milestones; defects found earlier via reviews/tests rather than only at final demo.

---

## D. Project Approval Form

I, \<Professor’s name\>, have reviewed the information contained in this document and approve the project proposal.

_________________________________          _________________________________  
Signature                                   Date

**Team acknowledgment:**

Czareena Angela Florence D. Canda __________________ Date __________

Saul Ramirez Barragan __________________ Date __________
