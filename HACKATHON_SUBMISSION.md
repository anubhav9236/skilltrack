# 🎯 SkillTrack — Appwrite Databases Hackathon 2026 Submission

> **A student opportunity & deadline management platform built with React, TypeScript, Tailwind CSS, and Appwrite TablesDB.**

---

## 📌 Executive Summary

* **Project Name:** SkillTrack
* **Tagline:** Discover, track, and conquer student opportunities powered by Appwrite TablesDB.
* **Hackathon:** Appwrite Databases Hackathon 2026
* **Category:** Web Applications / Developer & Student Productivity
* **Target Audience:** College students, self-taught developers, bootcamp graduates, and open-source contributors.

---

## 💡 The Problem

Students and early-career developers face an overwhelming flood of application deadlines scattered across disparate platforms:
* **Hackathons** on Devpost and Dev.to
* **Internships** on LinkedIn, Handshake, and company career pages
* **Scholarships** on university portals and non-profit foundations
* **Open Source fellowships** (GSoC, MLH, LFX) with complex multi-stage proposal deadlines
* **Certifications** (AWS, Linux Foundation, CNCF) with exam voucher expiration windows

Students often miss high-impact deadlines, lose track of application statuses (Planning vs. Applied vs. Shortlisted), or fail to document referral contacts and interview notes because they rely on clunky spreadsheets or scattered browser bookmarks.

---

## 🚀 The Solution: SkillTrack

**SkillTrack** is a modern, unified opportunities hub that gives students full command over their career pipeline:
1. **Interactive Dashboard:** Live metrics, visual status breakdown charts with Recharts, and urgent 7-day milestone alerts.
2. **Comprehensive Opportunity Management:** Full CRUD tracking with title, organization, category, direct application link, deadline, priority level, notes, and application status.
3. **Approaching Deadline Intelligence:** Highlights milestones due within 7 days, alerts for opportunities due today, and marks expired deadlines.
4. **Dedicated Bookmarking:** Instant star/pin mechanism to curate high-priority programs.
5. **Private Multi-User Security:** Powered by **Appwrite TablesDB** and Appwrite Authentication, ensuring each student's notes, status, and applications are isolated and private.
6. **Graceful Sandbox Mode:** Instant offline demo sandbox with realistic sample data allowing instant evaluation even prior to configuring cloud credentials.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + TypeScript + Vite |
| **Styling & Design System** | Tailwind CSS (Navy / Indigo aesthetic with Glassmorphism) |
| **Backend & Cloud Database** | **Appwrite TablesDB** (`appwrite` Web SDK v17) |
| **Authentication** | Appwrite Account Service (Email/Password sessions + Document-level RLS) |
| **Data Visualization** | Recharts (Responsive bar charts & interactive status breakdown donuts) |
| **Icons & Micro-animations** | Lucide React + Canvas Confetti (celebratory confetti on selection) |
| **Deployment** | Vercel (SPA routing configured via `vercel.json`) |

---

## 🗄️ Appwrite TablesDB Architecture & Implementation

### 1. Database & Table Schema
SkillTrack provisions an isolated database `skilltrack_db` and an `opportunities` table with strict data typing:

```
Database ID: skilltrack_db
Table ID:    opportunities
```

#### Table Attributes (Columns):
| Column Name | Data Type | Size | Required | Description |
|---|---|---|---|---|
| `userId` | String | 255 | **Yes** | Owner Appwrite User ID (`user.$id`) |
| `title` | String | 255 | **Yes** | Program title (e.g., *Google Summer of Code 2026*) |
| `organization` | String | 255 | **Yes** | Host entity (e.g., *Google Open Source*) |
| `category` | String | 50 | **Yes** | `Hackathon`, `Internship`, `Scholarship`, `Certification`, `Open Source` |
| `description` | String | 5000 | No | Overview, tracks, eligibility criteria |
| `applicationUrl` | String | 2048 | No | Direct link to official submission portal |
| `deadline` | String | 50 | **Yes** | ISO date string (`YYYY-MM-DD`) |
| `status` | String | 50 | **Yes** | `Interested`, `Planning`, `Applied`, `Shortlisted`, `Selected`, `Rejected` |
| `priority` | String | 50 | **Yes** | `Low`, `Medium`, `High` |
| `notes` | String | 5000 | No | Personal checklist, recruiter emails, interview notes |
| `isSaved` | Boolean | - | **Yes** | Starred/bookmarked status (default: `false`) |

---

### 2. Row-Level Security (RLS) & Document Permissions
Security is handled natively at the database engine level, not merely in the UI:
1. **Document Security:** Enabled on the table.
2. **Table Role Permissions:** Authenticated `Users` role is granted `Create` permission.
3. **Explicit Row Permissions:** When an opportunity is created via `appwriteService.createOpportunity()`, row-level access permissions are strictly restricted to the creator:
   ```typescript
   const permissions = [
     Permission.read(Role.user(userId)),
     Permission.update(Role.user(userId)),
     Permission.delete(Role.user(userId)),
   ];
   ```
4. **Server Query Isolation:** Data retrieval executes `Query.equal('userId', userId)`, ensuring no user can enumerate, view, or alter another user's opportunities.

---

### 3. Native Appwrite Web SDK Service Layer

The frontend interacts with TablesDB through a modular service layer (`src/services/appwriteService.ts`):
* `listUserOpportunities(userId)`: Queries opportunities sorted by creation time.
* `createOpportunity(userId, data)`: Generates an ID with `ID.unique()`, attaches the owner ID, and applies RLS permissions.
* `updateOpportunity(id, updates)`: Updates status, notes, or fields in real time.
* `deleteOpportunity(id)`: Permanently deletes the document from TablesDB.
* `toggleSaved(id, isSaved)`: Toggles bookmark state with optimistic UI updates.
* `updateStatus(id, status)`: Transitions opportunity across stages (`Planning` -> `Applied` -> `Shortlisted` -> `Selected`).

---

## ✨ Key Features & User Experience

* **Vibrant Modern Dashboard:** Real-time statistics showing Total, Saved, In Progress, and Deadlines within 7 days.
* **Interactive Pipeline Analytics:** Visual breakdown by category and application status powered by Recharts.
* **Urgent Deadline Highlighting:** Visual amber indicators for deadlines $\le 7$ days, pulse warnings for deadlines due today, and clear expired tags.
* **Celebration Confetti:** Marking an application status as `Selected` triggers confetti celebration.
* **Live Connection Diagnostics:** Built-in Appwrite connectivity tester with diagnostic feedback and `.env` setup guide.
* **Mobile-Responsive Sidebar & Drawer:** Seamless navigation across desktops, tablets, and phones.

---

## 🌐 Community Wisdom & Proven Patterns

In accordance with community best practices for Appwrite and React:
1. **Centralized Service Architecture:** As documented on [dev.to](https://dev.to) and the Appwrite community, all SDK instances (`Client`, `Account`, `Databases`) are initialized once in `src/lib/appwrite.ts` to prevent redundant network connections and maintain clean separation of concerns.
2. **Session Persistence:** Leveraging `account.get()` on boot to verify session cookie validity before rendering private routes avoids UI flicker and race conditions.
3. **Document-Level Permissions over Collection Openness:** Enforcing `Permission.read(Role.user(userId))` at the document insertion point ensures enterprise-grade multi-tenant privacy.

---

## 🚀 Deployment & Local Run Instructions

### Quick Local Start
```powershell
# 1. Clone repository
git clone <your-repo-url>
cd skilltrack

# 2. Install dependencies
npm install

# 3. Configure environment variables
Copy-Item .env.example .env
# Fill in your Appwrite Project ID and Database IDs in .env

# 4. Start local development server
npm run dev
```

### Vercel Deployment
1. Push project to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Set Framework Preset to **Vite**.
4. In **Environment Variables**, supply:
   - `VITE_APPWRITE_ENDPOINT`
   - `VITE_APPWRITE_PROJECT_ID`
   - `VITE_APPWRITE_DATABASE_ID`
   - `VITE_APPWRITE_TABLE_ID`
5. Click **Deploy**. SPA rewrites are already handled by `vercel.json`.
