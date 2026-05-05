# Polaris — Startup Incubation Management Platform
RNS Institute of Technology, Bengaluru | Team Polaris

## What is Polaris?
Polaris manages the full lifecycle of startup incubation programs — from applications to demo day. Five roles: admin, founder, mentor, investor, manager.

## Tech Stack
Next.js 14 App Router · Supabase · TypeScript · Tailwind CSS · shadcn/ui · TanStack Query v5 · Zustand · Zod v4

## Setup

### 1. Clone and install
git clone https://github.com/darshanashok-dev/int-project
cd int-project
npm install

### 2. Configure environment
cp .env.example .env.local
# Fill in your Supabase project URL and keys

### 3. Start Supabase locally
npx supabase start
npx supabase db reset  # applies migrations + seed

### 4. Start the dev server
npm run dev

## Roles
| Role | Access |
|------|--------|
| admin | Full control — cohorts, reviews, assignments |
| founder | Own startup — application, milestones, funding |
| mentor | Assigned startups — sessions, feedback |
| investor | Read-only — progress, funding milestones |
| manager | Programs, events, workshops |

## Module Build Order
Auth → Startup Management → Mentor Management → Program Management → Funding Tracker → Events → Analytics
