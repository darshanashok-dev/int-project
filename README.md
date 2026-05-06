# Polaris — Startup Incubation Management Platform

RNS Institute of Technology, Bengaluru | Team Polaris

Polaris is a premium, enterprise-grade Startup Incubation Management Platform designed to streamline and manage the entire lifecycle of startup cohorts — from initial application vetting to milestone tracking, mentoring, funding synchronization, and Demo Day. 

By unifying all stakeholders into a single, cohesive command center, Polaris removes the friction of managing complex incubation timelines, allowing startup cohorts to focus on velocity and scale.

---

## 🚀 Key Roles & Dashboards

Polaris features five distinct, role-based modules tailored to the unique goals of each stakeholder in the ecosystem:

| Role | Responsibility | Key Features |
| :--- | :--- | :--- |
| 👑 **Admin** | Ecosystem Governance | Cohort planning, application review board, scoring system, and mentor matching. |
| 🚀 **Founder** | Venture Growth | Startup profile builder, cohort application, milestone tracking, and funding history. |
| 🧠 **Mentor** | Advisory & Sessions | Mentoring log, cohort oversight, direct session scheduling, and advisory feedback. |
| 💼 **Investor** | Diligence & Tracking | Startup discovery portal, stage-by-stage filtration, and soft/hard interest signaling. |
| 🛡️ **Manager** | Operations & Programs | Workshop organization, event schedules, and performance analytics. |

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions, Middleware)
- **Database & Auth**: [Supabase](https://supabase.com/) (SSR Auth, PostgreSQL, Realtime Subscriptions)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Client-side global state)
- **Query & Cache**: [TanStack Query v5](https://tanstack.com/query/latest) (Robust server-state management)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) (Highly responsive, customized dark/light mode system)
- **Form Validation**: [React Hook Form](https://react-hook-form.com/) with [Zod v4](https://zod.dev/)

---

## 📂 Project Structure

```
├── app/                  # Next.js 14 App Router pages and layouts
│   ├── (auth)/           # Authentication routes (login, register)
│   ├── (dashboard)/      # Protected dashboard views (admin, founder, mentor, investor)
│   ├── api/              # Route handlers
│   └── globals.css       # Core stylesheet with HSL color tokens
├── components/           # Reusable UI components
│   ├── admin/            # Admin-specific components
│   ├── shared/           # Cross-dashboard layouts and components (sidebar, loading, error)
│   └── ui/               # Core atomic primitives (shadcn)
├── lib/                  # Helper utilities and custom hooks
│   ├── hooks/            # Custom TanStack Query custom hooks
│   ├── supabase/         # SSR Supabase clients (client, server, admin)
│   └── validations/      # Zod validation schemas
└── types/                # TypeScript type definitions and database definitions
```

---

## ⚙️ Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/darshanashok-dev/int-project
cd int-project
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and configure your Supabase credentials:
```bash
cp .env.example .env.local
```
Fill in the following values in your `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_MOCK_MODE=true` (Toggle `true` to use the high-fidelity mock data layer for local demonstrations)

### 3. Initialize Database (Local Supabase)
If you are developing against local Supabase:
```bash
npx supabase start
npx supabase db reset  # Applies migrations and seeds development data
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the platform.
