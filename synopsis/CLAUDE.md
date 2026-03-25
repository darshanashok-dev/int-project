# CLAUDE.md — Polaris: Startup Incubation Management Platform

## Project Overview

**Team:** Polaris | **Institute:** RNS Institute of Technology, Bengaluru
**Project:** Digital Platform for Monitoring Startup Incubation Programs
**Year:** 2025 | **Guide:** Mrs. Shyla N. (CSE)

Full-stack web platform centralizing startup incubation — onboarding, mentorship,
milestone tracking, funding, events, and analytics — across five stakeholder roles.

---

## Architecture

```
Browser
  └── Next.js (App Router) — TypeScript, Tailwind, shadcn/ui
        │
        ├── Next.js Middleware — auth session check, role-based route protection
        │
        └── Supabase JS Client
              ├── PostgreSQL (REST API, auto-generated)
              ├── Auth (session tokens, OAuth, user metadata)
              ├── Realtime (subscriptions for dashboard widgets)
              ├── Storage (pitch decks, documents)
              └── Edge Functions (Deno — email notifications, computed aggregates)

Hosting: Vercel (CI/CD on every git push)
```

**There is no custom Express/Node server.** All backend needs are handled by
Supabase. Any server-side logic that cannot run on the frontend goes in
Supabase Edge Functions.

> Note: The project abstract mentions "microservices" — in practice the
> implementation is a clean two-tier architecture (Next.js + Supabase). The
> "modules" are feature-scoped folders, not independent deployed services.

---

## Tech Stack

| Layer              | Technology                              |
|--------------------|-----------------------------------------|
| Framework          | Next.js 14+ (App Router, SSR + static)  |
| Language           | TypeScript (strict mode)                |
| Styling            | Tailwind CSS                            |
| UI Components      | shadcn/ui                               |
| State Management   | Zustand                                 |
| Server State       | TanStack React Query v5                 |
| Forms              | React Hook Form + Zod                   |
| Charts             | Recharts                                |
| Auth               | Supabase Auth (email/password + OAuth)  |
| Database           | Supabase PostgreSQL                     |
| Access Control     | Supabase Row-Level Security (RLS)       |
| File Storage       | Supabase Storage                        |
| Background Logic   | Supabase Edge Functions (Deno)          |
| Deployment         | Vercel                                  |

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-side / Edge Functions only — never expose to browser
```

---

## User Roles

Five roles stored as `user_metadata.role` in Supabase Auth.
Access enforced at two layers: Next.js middleware (routing) and Supabase RLS (data).

| Role               | What they can do                                              |
|--------------------|---------------------------------------------------------------|
| `admin`            | Full control — cohorts, mentor assignment, application review |
| `founder`          | Own startup only — application, milestones, funding, sessions |
| `mentor`           | Assigned startups only — sessions, feedback                   |
| `investor`         | Read-only — startup progress, funding milestones              |
| `manager`          | Programs, events, workshops, cohort logistics                 |

> RLS is the **authoritative** access boundary.
> Frontend routing guards are secondary UX, not security.
> For every data access suggestion, ask: "Which roles read/write this and is there an RLS policy?"

---

## Database Schema

```
users               — id, email  (roles live in Supabase Auth user_metadata, not here)
startups            — id, founder_id, name, sector, stage, status
applications        — id, startup_id, program_id, status, submitted_at
programs            — id, name, cohort, start_date, end_date, manager_id
mentors             — id, user_id, expertise, bio
mentor_assignments  — mentor_id, startup_id, assigned_by, assigned_at
sessions            — id, mentor_id, startup_id, scheduled_at, notes, feedback
milestones          — id, startup_id, title, due_date, status, completed_at
funding             — id, startup_id, type, amount, source, date, status
events              — id, program_id, title, type, date, location
event_registrations — event_id, user_id
reports             — id, startup_id, generated_by, period, data
```

All tables use `uuid` primary keys. All linked via foreign keys.
Always regenerate TypeScript types (`supabase gen types typescript`) after any schema change.

---

## Module Breakdown

1. **Auth & Role Management** — registration, login, password reset, middleware routing
2. **Startup Management** — application submission, profile, milestone tracking
3. **Mentor Management** — profiles, admin assignment, session scheduling, feedback
4. **Program Management** — cohort creation, application review and approval
5. **Funding Tracker** — grants, seed rounds, investment tracking per startup
6. **Event & Workshop Management** — training sessions, demo days, registrations
7. **Analytics Dashboard** — startup growth charts, program KPIs, funding progress

---

## Coding Conventions

### TypeScript
- Strict mode — no `any`, no `as unknown as X` hacks
- Always type Supabase query results using the generated `Database` types
- Derive form types from Zod schemas: `type T = z.infer<typeof schema>`

### File Structure (App Router)
```
/app
  /(auth)
    /login
    /register
  /(dashboard)
    /admin/...
    /founder/...
    /mentor/...
    /investor/...
    /manager/...
  /api/            ← minimal; prefer Supabase direct or Edge Functions
/components
  /ui/             ← shadcn/ui generated components — never edit directly
  /shared/         ← reusable across roles (e.g. MilestoneCard, AvatarUpload)
  /[module]/       ← scoped to one module (e.g. /funding, /events)
/lib
  /supabase/
    browser.ts     ← createBrowserClient (client components)
    server.ts      ← createServerClient (server components + actions)
    middleware.ts  ← session refresh + role-based redirects
  /validations/    ← all Zod schemas, one file per domain
  /hooks/          ← React Query hooks + Zustand stores
  /utils/
/types/            ← shared TypeScript interfaces (non-generated)
middleware.ts      ← Next.js root middleware (route protection)
```

### Supabase Client Setup

Use `@supabase/ssr`. Two separate client constructors — do not mix them:

```ts
// lib/supabase/browser.ts — for use in Client Components
import { createBrowserClient } from '@supabase/ssr'
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// lib/supabase/server.ts — for use in Server Components, Route Handlers, Actions
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export function createClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c) => c.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options))
      }
    }
  )
}
```

### Auth — Critical Rule

```ts
// CORRECT — secure, server-side, verifies with Supabase server
const { data: { user } } = await supabase.auth.getUser()

// WRONG — client-only, reads from local storage, never trust for authorization
const { data: { session } } = await supabase.auth.getSession()
```

Use `getUser()` for any server-side authorization check.
`getSession()` is only acceptable for reading the current session client-side
(e.g. displaying the user's name in a navbar).

### Data Fetching — React Query Pattern

Never call Supabase directly inside a component.
All reads go through a custom React Query hook:

```ts
// lib/hooks/use-milestones.ts
export function useMilestones(startupId: string) {
  return useQuery({
    queryKey: ['milestones', startupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('milestones')
        .select('id, title, due_date, status, completed_at')
        .eq('startup_id', startupId)
        .order('due_date', { ascending: true })
      if (error) throw error
      return data
    },
    staleTime: 30_000,
  })
}
```

For mutations, always invalidate affected query keys on success:

```ts
const queryClient = useQueryClient()
const { mutate } = useMutation({
  mutationFn: async (data: MilestoneFormData) => {
    const { error } = await supabase.from('milestones').insert(data)
    if (error) throw error
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['milestones', startupId] })
  },
})
```

### Query Key Conventions

```ts
['milestones', startupId]
['startups', 'list']
['startups', 'detail', startupId]
['sessions', mentorId]
['funding', startupId]
['events', programId]
['programs', 'list']
```

### Forms

Schema first — type is always inferred, never written separately:

```ts
// lib/validations/milestone.ts
export const milestoneSchema = z.object({
  title:    z.string().min(3, 'Minimum 3 characters'),
  due_date: z.coerce.date(),
  status:   z.enum(['pending', 'in_progress', 'completed']),
})
export type MilestoneFormData = z.infer<typeof milestoneSchema>
```

Use `zodResolver(milestoneSchema)` in `useForm`. Surface errors with shadcn/ui
`<FormMessage />`. Never use uncontrolled inputs.

### RLS Policies

Always comment which role a policy targets and the security intent:

```sql
-- founders: read milestones only for startups they own
create policy "founder_select_own_milestones"
on milestones for select
using (
  startup_id in (
    select id from startups where founder_id = auth.uid()
  )
);
```

Enable RLS on every new table immediately:
```sql
alter table milestones enable row level security;
```
RLS is **disabled by default** on new tables — forgetting this is a data exposure bug.

### Realtime Subscriptions

Set up in `useEffect` with cleanup. Coordinate `staleTime` in React Query
to avoid stale data when a subscription fires:

```ts
useEffect(() => {
  const channel = supabase
    .channel('milestones-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'milestones',
        filter: `startup_id=eq.${startupId}` },
      () => queryClient.invalidateQueries({ queryKey: ['milestones', startupId] })
    )
    .subscribe()
  return () => { supabase.removeChannel(channel) }
}, [startupId])
```

> Realtime requires the table to have **replication enabled** in the Supabase
> dashboard (Database → Replication). Easy to miss.

### Server Components vs Client Components

Prefer Server Components for initial data loads — they reduce client JS and
avoid loading spinners on first paint.
Use Client Components only when you need:
- `useState` / `useEffect` / other hooks
- event handlers
- Realtime subscriptions
- browser APIs

---

## Response Preferences

- Flag any data suggestion that could expose cross-role data without an RLS guard
- Prefer Supabase-native solutions (RLS, Edge Functions, Storage policies) before custom workarounds
- Always include the Zod schema and TypeScript types alongside any component code
- Charts: **Recharts only** — do not suggest Chart.js, Victory, or any alternative
- Do not suggest adding a custom Express or Node.js server — the architecture is intentionally serverless
- Edge Functions must be written in **Deno + TypeScript**
- UI components: **shadcn/ui only** — do not introduce Radix primitives directly or other libraries
- If a change touches the DB schema, provide the updated TypeScript types and the RLS migration together
- Respect Vercel edge/serverless constraints — no long-running synchronous operations

---

## Common Gotchas

| Gotcha | What to do |
|--------|------------|
| RLS off by default on new tables | `alter table X enable row level security;` immediately after `create table` |
| `getSession()` used for auth | Replace with `getUser()` on the server |
| Supabase Realtime not firing | Check replication is enabled for the table in the Supabase dashboard |
| React Query + Realtime conflict | Invalidate query keys in the subscription callback; set `staleTime` appropriately |
| `*` in `.select()` in production | List columns explicitly to avoid leaking future fields |
| `createBrowserClient` in Server Component | Use `createServerClient` from `lib/supabase/server.ts` instead |
| Role check on frontend only | Always pair frontend guards with an RLS policy — frontend is bypassable |

---

## Out of Scope (v1)

- Native mobile app
- Payment gateway integration
- AI/ML features
- Third-party CRM integrations
