# Implementation Plan: Venture Portfolio Management

## Overview

Extend the existing Polaris platform with a formalised portfolio management workflow. Tasks are ordered to build incrementally: shared validation and actions first, then the admin review enhancements, then the investor-facing views, and finally the analytics dashboard embedded in both dashboards.

## Tasks

- [x] 1. Add Zod validation schemas and RLS migration
  - [x] 1.1 Create `lib/validations/review-score.ts` with `reviewScoreSchema` (startupId uuid, teamScore/marketScore/tractionScore/uniquenessScore int 1–10, overallComment non-empty string)
    - _Requirements: 3.3, 3.4_
  - [x] 1.2 Create `lib/validations/investor-interest.ts` with `investorInterestSchema` (startupId uuid, signalType enum `watching|interested|committed`, note optional string)
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 1.3 Add the `investor_read_scores` RLS policy to `supabase/schema.sql` so investors can SELECT from `application_scores`
    - _Requirements: 8.6_

- [x] 2. Implement `saveReviewScoreAction` server action
  - [x] 2.1 Create `lib/actions/review-score.ts` with `saveReviewScoreAction`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Extend `StartupReviewActions` with scored review panel
  - [x] 3.1 Update `StartupReviewActionsProps` to accept `latestScores: { team_score, market_score, traction_score, uniqueness_score } | null`
    - _Requirements: 3.6, 3.7_
  - [x] 3.2 Add four numeric score inputs (1–10) above the existing comment textarea, pre-populated from `latestScores`
    - _Requirements: 3.3, 3.4, 3.6, 3.7_
  - [x] 3.3 Update `app/(dashboard)/admin/startups/[id]/page.tsx` to query the latest `application_scores` record and pass `latestScores` to `StartupReviewActions`
    - _Requirements: 3.7_

- [x] 4. Checkpoint — Admin review panel complete

- [x] 5. Implement typed investor interest server actions
  - [x] 5.1 Create `lib/actions/investor-interest.ts` with `upsertInterestAction`
    - Assert caller has `investor` role
    - Validate with `investorInterestSchema`
    - Upsert into `investor_interests` with `onConflict: 'investor_id,startup_id'` to prevent duplicates
    - Revalidate `/investor`, `/investor/portfolio`, `/investor/pipeline`
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 5.2 Add `removeInterestAction` to `lib/actions/investor-interest.ts`
    - Assert caller has `investor` role
    - Delete the `investor_interests` record matching `(investor_id, startup_id)`
    - Revalidate relevant paths
    - _Requirements: 6.5_

- [x] 6. Create React Query hooks for investor interests and portfolio analytics
  - [x] 6.1 Create `lib/hooks/use-investor-interests.ts`
    - Query `investor_interests` joined with `startups(name, sector, stage)` for the current investor
    - `queryKey: ['investor-interests', investorId]`
    - `staleTime: 30_000`
    - _Requirements: 6.4_
  - [x] 6.2 Create `lib/hooks/use-portfolio-analytics.ts`
    - Query `startups` for status, sector, and stage columns
    - Compute status breakdown counts, sector distribution, and stage distribution in the hook
    - For investor role, also query `investor_interests` filtered to `signal_type IN ('interested','committed')` for the "my interests" count
    - Subscribe to `postgres_changes` on the `startups` table; on change, call `queryClient.invalidateQueries` for the analytics query key
    - Clean up the Supabase channel in the `useEffect` return
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6_

- [x] 7. Build `PortfolioAnalytics` shared component
  - [x] 7.1 Create `components/portfolio/PortfolioAnalytics.tsx` as a client component
    - Accept `role: 'admin' | 'investor'` and optional `investorId?: string` props
    - Use `usePortfolioAnalytics(role, investorId)` hook
    - Render four status stat cards (pending / active / waitlisted / rejected)
    - Render sector distribution `BarChart` and stage distribution `BarChart`, each wrapped in `ResponsiveContainer`; add `aria-label` to each chart container
    - For investor role, render a "My Interests" count card (interested + committed)
    - Show a loading skeleton while data is fetching; show an inline error with a retry button on failure
    - Include rich mock data fallback so the component renders meaningfully with no live DB data
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 7.6_
  - [x] 7.2 Embed `<PortfolioAnalytics role="admin" />` as a section in `app/(dashboard)/admin/page.tsx`
    - Add below the existing stats grid
    - _Requirements: 7.7_
  - [x] 7.3 Embed `<PortfolioAnalytics role="investor" investorId={user.id} />` as a section in `app/(dashboard)/investor/page.tsx`
    - _Requirements: 7.8_

- [x] 8. Build investor portfolio list view
  - [x] 8.1 Create `components/portfolio/InvestorPortfolioList.tsx` as a client component
    - Accept `initialStartups: StartupRow[]`
    - Implement client-side filtering: sector dropdown, stage dropdown, status dropdown, and name search input (case-insensitive)
    - Display each startup's name, sector, stage, and status badge
    - Clicking a row navigates to `/investor/portfolio/[id]`
    - Include rich mock data fallback for presentation when DB is empty
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [x] 8.2 Update `app/(dashboard)/investor/portfolio/page.tsx` to fetch all startups and pass as `initialStartups` to `InvestorPortfolioList`
    - Assert caller has `investor` role; redirect to `/login` if not
    - Fetch all startups (id, name, sector, stage, status, elevator_pitch) ordered by `created_at` descending
    - _Requirements: 5.1_

- [x] 9. Build investor startup detail view
  - [x] 9.1 Create `app/(dashboard)/investor/portfolio/[id]/page.tsx` as a server component
    - Assert caller has `investor` role
    - Fetch startup public fields only — do NOT select `founder_id`, email, or full_name
    - Fetch the most recent `application_scores` record for the startup
    - Fetch the investor's existing `investor_interests` record for this startup if one exists
    - Call `notFound()` if startup does not exist
    - _Requirements: 8.1, 8.2, 8.3, 8.5_
  - [x] 9.2 Create `components/portfolio/InvestorStartupDetail.tsx` as a client component
    - Render startup public profile (name, sector, stage, elevator pitch, target market, competitive advantage, revenue model, funding round details)
    - Render read-only admin scores section (team, market, traction, uniqueness, comment) only when `latestAdminScore` is not null
    - Render interest tracking form: signal type selector and note textarea, pre-populated from `initialInterest`
    - On save, call `upsertInterestAction`; on remove, call `removeInterestAction`; update UI without full page reload
    - Do NOT render founder email or full name anywhere in this component
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 10. Wire sidebar navigation for investor portfolio route
  - [x] 10.1 Verify `/investor/portfolio` is linked in the shared sidebar for the investor role
    - If missing, add a "Portfolio" nav item pointing to `/investor/portfolio`
    - _Requirements: 5.1_

- [-] 11. Final checkpoint — Ensure all pages render with mock data and are presentation-ready
  - Verify admin dashboard shows `PortfolioAnalytics` section with charts
  - Verify investor dashboard shows `PortfolioAnalytics` section with "My Interests" card
  - Verify `/investor/portfolio` renders the filterable startup list
  - Verify `/investor/portfolio/[id]` renders startup detail with interest form
  - Verify admin startup detail page shows scored review panel inline

## Notes

- All server actions follow the `assertRoleAccess → validate → DB operation → revalidatePath → return { success }` pattern
- The `investor_read_scores` RLS policy is already in `supabase/schema.sql`
- Recharts `BarChart` components must be wrapped in `ResponsiveContainer`; chart containers need `aria-label` for accessibility
- The `startups` table must have replication enabled in the Supabase Dashboard for the Realtime subscription in `use-portfolio-analytics.ts` to fire
- All components must include mock data fallbacks so the UI is presentation-ready even without live DB data
- `lib/actions/investor-interest.ts` should be the canonical typed action file; `app/(dashboard)/investor/actions.ts` can remain for legacy form-based usage
