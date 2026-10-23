# 🎯 SkillTrack — Student Opportunity Management Platform

[![Appwrite Databases](https://img.shields.io/badge/Appwrite-TablesDB_17.0-F02E65?logo=appwrite&logoColor=white)](https://appwrite.io)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Live Demo](https://img.shields.io/badge/Live_Demo-skilltrack--seven--blush.vercel.app-success?logo=vercel&logoColor=white)](https://skilltrack-seven-blush.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github&logoColor=white)](https://github.com/anubhav9236/skilltrack)

**SkillTrack** is a modern, student opportunity and application management platform built for the **Appwrite Databases Hackathon 2026**. It empowers students and developers to discover, track, and conquer hackathons, internships, scholarships, certifications, and open-source programs in one organized workspace.

🔗 **Live Deployment:** [https://skilltrack-seven-blush.vercel.app/](https://skilltrack-seven-blush.vercel.app/)  
📂 **GitHub Repository:** [https://github.com/anubhav9236/skilltrack](https://github.com/anubhav9236/skilltrack)

---

## 🌟 Core Features

- **🔐 Appwrite Authentication:** Clean email & password sign up, login, session persistence across page refreshes, and instant Sandbox Demo mode for testing.
- **📊 Real-Time Analytics Dashboard:** Instant pipeline metrics, interactive Recharts category distribution and status breakdown charts, and urgent deadline alerts.
- **💼 Complete Opportunity Management:** Full CRUD operations with title, organization, category, direct application link, deadline, priority level, notes, and application status.
- **⏰ Smart Deadline Intelligence:** Automatic countdowns, urgent highlighting for deadlines approaching within 7 days, alerts for opportunities due today, and past deadline markers.
- **⭐ Dedicated Bookmarks & Saved Hub:** Star and pin top opportunities for rapid access.
- **🛡️ Secure Multi-Tenant Architecture:** Powered by **Appwrite TablesDB** with row-level security (`Permission.read(Role.user(userId))`), ensuring no user can access or modify another student's private data.
- **🩺 Built-in Connection Diagnostics:** Integrated Appwrite health checker and step-by-step setup walkthrough right in the application.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (Navy / Indigo palette with glassmorphism effects)
- **Backend & Database:** Appwrite Cloud (TablesDB + Appwrite Auth)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Micro-Animations:** Canvas Confetti

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended, tested on Node v24)
- npm (v9 or higher)

### Step 1: Clone and Navigate
```powershell
cd skilltrack
```

### Step 2: Install Dependencies
```powershell
npm install
```

### Step 3: Configure Environment Variables
Copy the template configuration file:
```powershell
Copy-Item .env.example .env
```

Open `.env` in your text editor and supply your Appwrite project credentials:
```env
# Appwrite Cloud endpoint
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1

# Your Appwrite Project ID (from Appwrite Console > Project Settings)
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id

# Database ID
VITE_APPWRITE_DATABASE_ID=skilltrack_db

# Table or Collection ID
VITE_APPWRITE_TABLE_ID=opportunities
```

> **Note:** If you run the application before entering Appwrite credentials, SkillTrack will automatically activate **Demo Sandbox Mode** so you can immediately explore all UI features, test filters, create sample opportunities, and see the charts in action.

### Step 4: Run the Development Server
```powershell
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🗄️ Appwrite TablesDB Setup Guide

Follow these quick steps in the [Appwrite Console](https://cloud.appwrite.io):

### 1. Create a Database
- Go to **Databases** > Click **Create database**.
- Set **Database ID** to `skilltrack_db` (or match your `.env`).

### 2. Create the Table / Collection
- Inside your database, click **Create Table** (or Create Collection).
- Name: `Opportunities`
- **Table ID**: `opportunities` (or match your `.env`).

### 3. Configure Document Security & Permissions
- Go to Table **Settings** > **Permissions**.
- Enable **Document Security** (toggled ON).
- Add the role **Users** and grant **Create** permission.
- *(Read, Update, and Delete permissions are assigned automatically by SkillTrack's SDK service on each insert using the creator's user ID).*

### 4. Create the Table Attributes (Columns)
In the Table **Attributes** tab, create the following 11 attributes:

| Attribute Key | Type | Size | Required | Description |
|---|---|---|---|---|
| `userId` | String | 255 | **Yes** | Appwrite User ID for row security |
| `title` | String | 255 | **Yes** | Opportunity title |
| `organization` | String | 255 | **Yes** | Host organization |
| `category` | String | 50 | **Yes** | Hackathon, Internship, Scholarship, etc. |
| `description` | String | 5000 | No | Detailed description |
| `applicationUrl` | String | 2048 | No | Direct apply URL |
| `deadline` | String | 50 | **Yes** | ISO date string (`YYYY-MM-DD`) |
| `status` | String | 50 | **Yes** | Interested, Planning, Applied, Shortlisted, Selected, Rejected |
| `priority` | String | 50 | **Yes** | Low, Medium, High |
| `notes` | String | 5000 | No | Personal checklist & interview notes |
| `isSaved` | Boolean | - | **Yes** | Bookmark flag (default: false) |

### 5. Register Web Platform (CORS)
- In **Project Overview** > **Integrate with your server or client** > Click **Web App**.
- Name: `SkillTrack Web`
- Hostname for Local: `localhost`
- Hostname for Production: Add your Vercel deployment domain (e.g. `skilltrack.vercel.app`).

---

## 📦 Building for Production

To validate the TypeScript build and compile the optimized production bundle:
```powershell
npm run build
```

To preview the production build locally:
```powershell
npm run preview
```

---

## 🚢 Vercel Deployment Guide

1. Push your repository to GitHub:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit of SkillTrack platform"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Framework Preset: **Vite** (auto-detected).
5. In **Environment Variables**, add:
   - `VITE_APPWRITE_ENDPOINT`
   - `VITE_APPWRITE_PROJECT_ID`
   - `VITE_APPWRITE_DATABASE_ID`
   - `VITE_APPWRITE_TABLE_ID`
6. Click **Deploy**. SPA client routing is pre-configured via `vercel.json`.

---

## 📁 Project Structure

```
skilltrack/
├── .env.example                 # Environment variables specification
├── .gitignore                   # Excludes node_modules, build outputs, and secrets
├── index.html                   # HTML template with SEO tags and custom typography
├── package.json                 # Project dependencies & npm scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Custom navy/indigo theme styling
├── tsconfig.json                # TypeScript project references
├── tsconfig.app.json            # Application TypeScript bundler rules
├── vercel.json                  # SPA routing configuration for Vercel
├── HACKATHON_SUBMISSION.md      # Detailed hackathon problem, solution, and TablesDB docs
├── src/
│   ├── App.tsx                  # Root router with protected layout hierarchy
│   ├── index.css                # Tailwind directives, glassmorphism, scrollbars
│   ├── main.tsx                 # React application entry point
│   ├── vite-env.d.ts            # Vite environment typing declarations
│   ├── components/
│   │   ├── common/              # Badge, Button, Modal, ConfirmModal, EmptyState, StatusBanner
│   │   ├── dashboard/           # StatCard, ActivityChart, UpcomingDeadlineList, RecentOpportunitiesList
│   │   ├── layout/              # AppLayout, Navbar, Sidebar
│   │   └── opportunities/       # OpportunityCard, OpportunityForm, OpportunityDetailsModal, QuickStatusMenu
│   ├── context/
│   │   ├── AuthContext.tsx      # Appwrite authentication and session management
│   │   └── OpportunityContext.tsx # Centralized CRUD, caching, metrics, and filtering
│   ├── lib/
│   │   ├── appwrite.ts          # Centralized Appwrite SDK client & health check
│   │   └── utils.ts             # Date calculation, deadline formatting, styling helpers
│   ├── pages/
│   │   ├── DashboardPage.tsx    # Live KPI metrics, charts, upcoming deadlines, recent feed
│   │   ├── OpportunitiesPage.tsx# Filterable & searchable opportunities grid with modal forms
│   │   ├── DeadlinesPage.tsx    # Urgent (<= 7 days) and expired milestones page
│   │   ├── SavedOpportunitiesPage.tsx # Bookmarked and pinned opportunities page
│   │   ├── SetupGuidePage.tsx   # Interactive Appwrite TablesDB setup & live connection tester
│   │   ├── LoginPage.tsx        # Appwrite user login & instant sandbox access
│   │   └── RegisterPage.tsx     # Appwrite user sign-up with input validation
│   ├── services/
│   │   ├── appwriteService.ts   # TablesDB CRUD operations with document-level security
│   │   └── mockData.ts          # Realistic seed data for sandbox demo mode
│   └── types/
│       └── database.ts          # TypeScript interfaces for opportunities, categories, and users
```

---

## 📄 License

MIT License. Built with ❤️ for the **Appwrite Databases Hackathon 2026**.
