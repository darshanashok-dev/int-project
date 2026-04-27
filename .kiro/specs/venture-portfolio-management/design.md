# Design Document: Venture Portfolio Management

## Overview

This feature extends the existing Polaris platform with a formalised portfolio management workflow. The system already has a `startups` table with basic status management, an `application_scores` table with score columns, and an `investor_interests` table. This design builds on those foundations rather than replacing them.

The three main capability areas are:

1. **Admin review workflow** — scored review notes (team/market/traction/uniqueness) inline in the existing startup detail panel, plus the existing status management.
2. **Investor portfolio view** — a filterable startup browser, per-startup detail pages with interest tracking, and read-only visibility of admin review scores.
3. **Portfolio analytics dashboard** — aggregate metrics (status breakdown, sector/stage distribution) embedded as a section inside the existing admin and investor dashboard pages.

All new UI is built with the existing design language: `bg-white border border-border/50 rounded-2xl shadow-sm` cards, Tailwind utility classes, and shadcn/ui components. Charts use Recharts wrapped in `ResponsiveContainer`.

---

## Architecture

The app follows Next.js 14 App Router conventions with a clear server/client split:

- **Server Components** fetch data via `createClient()` from `lib/supabase/server.ts` and pass it as props.
- **Client Components** (`'use client'`) handle interactivity. Data fetching in client components uses React Query hooks (`lib/hooks/`).
- **Server Actions** (`'use server'`) handle all mutations, with role assertions at the top of every action.
- **Realtime** is used only for the analytics dashboard counters, via a Supabase channel subscription that invalidates the React Query cache on change.

```
app/(dashboard)/
  admin/
    page.tsx                        ← embed <PortfolioAnalytics /> here
    startups/
      page.tsx                      ← existing StartupTable (no route change)
      [id]/
        page.tsx                    ← extend with scored review panel
        StartupReviewActions.tsx    ← extend with score inputs
  investor/
    page.tsx                        ← embed <PortfolioAnalytics /> here
    portfolio/
      page.tsx                      ← new: investor portfolio list
      [id]/
        page.tsx                    ← new: investor startup detail

components/
  portfolio/
    PortfolioAnalytics.tsx          ← shared analytics section (client)
    InvestorPortfolioList.tsx       ← investor browse list (client)
    InvestorStartupDetail.tsx       ← investor detail + interest form (client)

lib/
  hooks/
    use-portfolio-analytics.ts      ← React Query + Realtime
    use-investor-interests.ts       ← React Query for interests
  validations/
    review-score.ts                 ← Zod schema for scored review
    investor-interest.ts            ← Zod schema for interest upsert
  actions/
    review-score.ts                 ← saveReviewScoreAction
    investor-interest.ts            ← upsertInterestAction, removeInterestAction
```

---

## Components and Interfaces

### 1. `StartupReviewActions` (extended)

Existing client component at `app/(dashboard)/admin/startups/[id]/StartupReviewActions.tsx`. Extended to include four numeric score inputs (1–10) for team, market, traction, and uniqueness above the existing comment textarea. The save action is replaced with `saveReviewScoreAction`.

Props (extended):
```ts
interface StartupReviewActionsProps {
  startup: { id: string; status: string }
  latestReviewNote: string
  latestReviewAt: string | null
  applicationsCount: number
  latestApplicationStatus: string | null
  // new
  latestScores: {
    team_score: number | null
    market_score: number | null
    traction_score: number | null
    uniqueness_score: number | null
  } | null
}
```

### 2. `PortfolioAnalytics`

New shared client component at `components/portfolio/PortfolioAnalytics.tsx`. Embedded as a section in both `app/(dashboard)/admin/page.tsx` and `app/(dashboard)/investor/page.tsx`.

Props:
```ts
interface PortfolioAnalyticsProps {
  role: 'admin' | 'investor'
  investorId?: string   // only for investor role — drives "my interests" count
}
```

Internally uses `usePortfolioAnalytics(role, investorId)` React Query hook. Renders:
- Status breakdown (4 stat cards: pending / active / waitlisted / rejected)
- Sector distribution bar chart (Recharts `BarChart`)
- Stage distribution bar chart (Recharts `BarChart`)
- For investors only: "My Interests" count card (interested + committed)

### 3. `InvestorPortfolioList`

New client component at `components/portfolio/InvestorPortfolioList.tsx`. Rendered by `app/(dashboard)/investor/portfolio/page.tsx` (server component that passes initial data).

Props:
```ts
interface InvestorPortfolioListProps {
  initialStartups: StartupRow[]
}
```

Handles client-side filtering by sector, stage, status, and name search. Clicking a row navigates to `/investor/portfolio/[id]`.

### 4. `InvestorStartupDetail`

New client component at `components/portfolio/InvestorStartupDetail.tsx`. Rendered by `app/(dashboard)/investor/portfolio/[id]/page.tsx`.

Props:
```ts
interface InvestorStartupDetailProps {
  startup: StartupPublicRow
  latestAdminScore: AdminScoreRow | null
  initialInterest: InvestorInterestRow | null
  investorId: string
}
```

Renders the public startup profile, the read-only admin scores section (if present), and the interest tracking form (signal type selector + note textarea). Mutations go through `upsertInterestAction` / `removeInterestAction`.

---

## Data Models

### Existing tables used (no schema changes needed)

**`startups`** — all existing columns used as-is.

**`application_scores`** — already has `team_score`, `market_score`, `traction_score`, `uniqueness_score`, `overall_comment`, `reviewer_id`, `scored_at`. The existing `saveStartupReviewNoteAction` only writes `overall_comment`; the new `saveReviewScoreAction` writes all five fields.

**`investor_interests`** — already has `investor_id`, `startup_id`, `signal_type`, `note`. The `signal_type` values used are `watching`, `interested`, `committed`.

### RLS additions needed

The `application_scores` table currently has a single policy:
```sql
CREATE POLICY "admin_manager_manage_scores" ON public.application_scores FOR ALL
  USING (public.is_role(ARRAY['admin', 'manager']));
```

Investors need read-only access to scores (Requirement 8.6). Add:
```sql
CREATE POLICY "investor_read_scores"
ON public.application_scores FOR SELECT
USING (public.is_role(ARRAY['investor']));
```

### Zod validation schemas

```ts
// lib/validations/review-score.ts
export const reviewScoreSchema = z.object({
  startupId:       z.string().uuid(),
  teamScore:       z.number().int().min(1).max(10),
  marketScore:     z.number().int().min(1).max(10),
  tractionScore:   z.number().int().min(1).max(10),
  uniquenessScore: z.number().int().min(1).max(10),
  overallComment:  z.string().min(1, 'Comment is required'),
})
export type ReviewScoreData = z.infer<typeof reviewScoreSchema>

// lib/validations/investor-interest.ts
export const investorInterestSchema = z.object({
  startupId:  z.string().uuid(),
  signalType: z.enum(['watching', 'interested', 'committed']),
  note:       z.string().optional(),
})
export type InvestorInterestData = z.infer<typeof investorInterestSchema>
```

### React Query hooks

```ts
// lib/hooks/use-portfolio-analytics.ts
// Fetches status counts, sector distribution, stage distribution
// Subscribes to postgres_changes on 'startups' table for live updates

// lib/hooks/use-investor-interests.ts
// Fetches investor_interests for the current investor
// queryKey: ['investor-interests', investorId]
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Score persistence round-trip

*For any* valid set of review scores (team, market, traction, uniqueness each 1–10) and a non-empty comment string, saving a review score record and then reading back the most recent `application_scores` record for that application SHALL return the same four numeric values and the same comment text.

**Validates: Requirements 3.3, 3.7**

### Property 2: Status constraint enforcement

*For any* string value that is not one of `active`, `pending`, `waitlisted`, or `rejected`, calling `updateStartupStatusAction` with that value SHALL return `{ success: false }` and leave the startup's `status` field unchanged in the database.

**Validates: Requirements 2.1, 2.3**

### Property 3: Interest upsert idempotence and data persistence

*For any* investor–startup pair, signal type, and note string, calling `upsertInterestAction` twice with the same arguments SHALL result in exactly one `investor_interests` record — not two — and that record SHALL contain the signal type and note from the call.

**Validates: Requirements 6.1, 6.3, 8.4**

### Property 4: Interest removal completeness

*For any* existing `investor_interests` record, calling `removeInterestAction` SHALL result in zero records matching that `(investor_id, startup_id)` pair in the database.

**Validates: Requirements 6.5**

### Property 5: Portfolio analytics counts consistency

*For any* array of startup objects with status values drawn from the allowed set, the sum of the per-status counts (pending + active + waitlisted + rejected) computed by the analytics aggregation logic SHALL equal the total length of the array. Additionally, for any investor's interest records, the "my interests" count SHALL equal the number of records whose `signal_type` is `interested` or `committed`.

**Validates: Requirements 7.1, 4.4, 7.6**

### Property 6: Startup filter correctness

*For any* list of startups and any filter value (search text, sector, stage, or status), the filtered result SHALL contain only rows that satisfy the filter predicate, and every row in the original list that satisfies the predicate SHALL appear in the result (no false negatives, no false positives). The name/sector search SHALL be case-insensitive.

**Validates: Requirements 4.2, 4.3, 5.2, 5.3, 5.4, 5.5**

### Property 7: Founder PII isolation

*For any* startup with a founder email and full name, rendering the `InvestorStartupDetail` component SHALL produce output that does not contain the founder's email address or full name string.

**Validates: Requirements 8.5**

---

## Error Handling

| Scenario | Handling |
|---|---|
| Admin saves review with empty comment | Zod validation rejects before server action is called; form shows inline error |
| Admin saves review but no application exists for startup | `saveReviewScoreAction` returns `{ success: false, error: 'No application found for this startup.' }` |
| Status update with invalid value | Server action validates against allowlist; returns `{ success: false, error: 'Invalid status.' }` |
| Unauthenticated request to any server action | `assertRoleAccess()` throws; action returns `{ success: false, error: 'Unauthorized' }` |
| Investor attempts to write `application_scores` | RLS policy blocks the insert; Supabase returns a permission error |
| Investor interest upsert conflict | Use `upsert` with `onConflict: 'investor_id,startup_id'` to handle gracefully |
| Startup not found on detail page | `notFound()` from `next/navigation` renders the 404 page |
| React Query fetch failure | Error state rendered inline with a retry button; no full-page crash |

All server actions follow the pattern:
```ts
export async function someAction(...) {
  try {
    await assertRoleAccess(['admin'])  // or ['investor']
    // validate with Zod
    // execute DB operation
    revalidatePath(...)
    return { success: true }
  } catch (err) {
    console.error(err)
    return { success: false, error: 'Descriptive message' }
  }
}
```

---

## Testing Strategy

### Unit tests (Vitest)

Focus on pure logic and validation:

- `reviewScoreSchema` — valid inputs pass, invalid scores (0, 11, non-integer) fail, empty comment fails
- `investorInterestSchema` — valid signal types pass, unknown signal type fails
- Status allowlist validation in `updateStartupStatusAction`
- Portfolio analytics count summation: given a mock array of startups, verify counts sum to total (Property 5)
- Score round-trip: given mock DB responses, verify the data returned matches what was written (Property 1)

### Property-based tests (fast-check, minimum 100 iterations each)

**Feature: venture-portfolio-management, Property 1: Score persistence round-trip**
Generate random score tuples (four integers 1–10) and random non-empty strings as comments. Call `saveReviewScoreAction` with a mock DB, read back the record, assert all five fields match.

**Feature: venture-portfolio-management, Property 2: Status constraint enforcement**
Generate arbitrary strings not in `['active', 'pending', 'waitlisted', 'rejected']` (including empty string, whitespace, SQL fragments, very long strings). Assert `updateStartupStatusAction` returns `{ success: false }` for every generated value.

**Feature: venture-portfolio-management, Property 3: Interest upsert idempotence and data persistence**
Generate random `signalType` values from the allowed enum and random note strings. Call `upsertInterestAction` twice with the same investor–startup pair. Assert exactly one record exists and it contains the provided signal type and note.

**Feature: venture-portfolio-management, Property 5: Portfolio analytics counts consistency**
Generate arrays of startup objects with random status values drawn from `['pending','active','waitlisted','rejected']`. Run the aggregation logic, assert sum of per-status counts equals array length. Also generate random interest arrays with mixed signal types, assert "my interests" count equals filtered count for `interested` + `committed`.

**Feature: venture-portfolio-management, Property 6: Startup filter correctness**
Generate random startup arrays and random filter values (search strings, sector strings, stage strings, status strings). Apply the filter function, assert every result satisfies the predicate and no satisfying row is missing. Test case-insensitivity by generating mixed-case search strings.

**Feature: venture-portfolio-management, Property 7: Founder PII isolation**
Generate random founder email addresses and full names. Render `InvestorStartupDetail` with those values in the startup object. Assert the rendered string does not contain the email or full name.

### Integration tests

- Admin review panel renders score inputs and pre-populates with latest scores from DB
- Investor detail page renders admin scores read-only when a score record exists, hides them when none exists
- Investor detail page does not render founder email or full name
- `PortfolioAnalytics` component renders status breakdown cards and two charts
- Realtime subscription: mock a `postgres_changes` event and assert React Query cache is invalidated

### Accessibility

- All score inputs have associated `<label>` elements
- Chart containers include `aria-label` describing the chart content
- Signal type selector uses a `<select>` or accessible radio group, not a custom div
