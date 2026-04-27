# Implementation Plan: Venture Portfolio Management

## Overview

Extend the existing Polaris platform with a formalised portfolio management workflow. Tasks are ordered to build incrementally: shared validation and actions first, then the admin review enhancements, then the investor-facing views, and finally the analytics dashboard embedded in both dashboards.

## Tasks

- [ ] 1. Add Zod validation schemas and RLS migration
  - [ ] 1.1 Create `lib/validations/review-score.ts` with `reviewScoreSchema` (startupId uuid, teamScore/marketScore/tractionScore/uniquenessScore int 1–10, overallComment non-empty string)
    - _Requirements: 3.3, 3.4_
  - [ ] 1.2 Create `lib/validations/investor-interest.ts` with `investorInterestSchema` (startupId uuid, signalType enum `watching|interested|committed`, note optional string)
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ] 1.3 Add the `investor_read_scores` RLS policy to `supabase/schema.sql` so investors can SELECT from `application_scores`
    - ```sql
      CREATE POLICY "investor_read_scores"
      ON public.application_scores FOR SELECT
      USING (public.is_role(ARRAY['investor']));
      ```
    - _Requirements: 8.6_

- [ ] 2. Implement `saveReviewScoreAction` server action
  - [ ] 2.1 Create `lib/actions/review-score.ts` with `saveReviewScoreAction`
    - Call `assertAdminAccess()` (reuse pattern from `app/(dashboard)/admin/startups/actions.ts`)
    - Validate input with `reviewScoreSchema`; return `{ success: false, error }` on validation failure
    - Look up the most recent application for the startup; return descriptive error if none found
    - Insert into `application_scores` with all five fields (`team_score`, `market_score`, `traction_score`, `uniqueness_score`, `overall_comment`, `reviewer_id`, `scored_at`)
    - Call `revalidatePath` for `/admin/startups` and `/admin/startups/[id]`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ]* 2.2 Write property test for score persistence round-trip (Property 1)
    - **Property 1: Score persistence round-trip**
    - Generate random score tuples (four integers 1–10) and random non-empty comment strings using fast-check
    - Mock the Supabase client; call `saveReviewScoreAction`, read back the inserted record, assert all five fields match
    - **Validates: Requirements 3.3, 3.7**
  - [ ]* 2.3 Write unit tests for `saveReviewScoreAction`
    - Test empty comment returns `{ success: false }`
    - Test invalid score values (0, 11, non-integer) are rejected by Zod
    - Test missing application returns descriptive error
    - _Requirements: 3.4, 3.5_

- [ ] 3. Extend `StartupReviewActions` with scored review panel
  - [ ] 3.1 Update `StartupReviewActionsProps` in `app/(dashboard)/admin/startups/[id]/StartupReviewActions.tsx` to accept `latestScores: { team_score, market_score, traction_score, uniqueness_score } | null`
    - _Requirements: 3.6, 3.7_
  - [ ] 3.2 Add four numeric score inputs (1–10) above the existing comment textarea, pre-populated from `latestScores`
    - Use `<label>` elements associated with each input for accessibility
    - Wire the save button to call `saveReviewScoreAction` instead of `saveStartupReviewNoteAction`
    - Display inline validation errors from Zod (empty comment, out-of-range scores)
    - _Requirements: 3.3, 3.4, 3.6, 3.7_
  - [ ] 3.3 Update `app/(dashboard)/admin/startups/[id]/page.tsx` to query the latest `application_scores` record for all five fields and pass `latestScores` to `StartupReviewActions`
    - _Requirements: 3.7_
  - [ ]* 3.4 Write unit tests for the score input UI
    - Test that pre-populated values render correctly
    - Test that submitting with an empty comment shows a validation error
    - _Requirements: 3.4, 3.6_

- [ ] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement investor interest server actions
  - [ ] 5.1 Create `lib/actions/investor-interest.ts` with `upsertInterestAction`
    - Assert caller has `investor` role
    - Validate with `investorInterestSchema`
    - Upsert into `investor_interests` with `onConflict: 'investor_id,startup_id'` to prevent duplicates
    - Revalidate relevant paths
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ] 5.2 Add `removeInterestAction` to `lib/actions/investor-interest.ts`
    - Assert caller has `investor` role
    - Delete the `investor_interests` record matching `(investor_id, startup_id)`
    - Revalidate relevant paths
    - _Requirements: 6.5_
  - [ ]* 5.3 Write property test for interest upsert idempotence (Property 3)
    - **Property 3: Interest upsert idempotence and data persistence**
    - Generate random signal types from the allowed enum and random note strings
    - Call `upsertInterestAction` twice with the same investor–startup pair; assert exactly one record exists with the correct signal type and note
    - **Validates: Requirements 6.1, 6.3, 8.4**
  - [ ]* 5.4 Write property test for interest removal completeness (Property 4)
    - **Property 4: Interest removal completeness**
    - For any existing interest record, call `removeInterestAction` and assert zero records remain for that `(investor_id, startup_id)` pair
    - **Validates: Requirements 6.5**

- [ ] 6. Create React Query hooks for investor interests and portfolio analytics
  - [ ] 6.1 Create `lib/hooks/use-investor-interests.ts`
    - Query `investor_interests` joined with `startups(name, sector, stage)` for the current investor
    - `queryKey: ['investor-interests', investorId]`
    - `staleTime: 30_000`
    - _Requirements: 6.4_
  - [ ] 6.2 Create `lib/hooks/use-portfolio-analytics.ts`
    - Query `startups` for status, sector, and stage columns
    - Compute status breakdown counts, sector distribution, and stage distribution in the hook
    - For investor role, also query `investor_interests` filtered to `signal_type IN ('interested','committed')` for the "my interests" count
    - Subscribe to `postgres_changes` on the `startups` table; on change, call `queryClient.invalidateQueries` for the analytics query key
    - Clean up the Supabase channel in the `useEffect` return
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6_
  - [ ]* 6.3 Write property test for portfolio analytics counts consistency (Property 5)
    - **Property 5: Portfolio analytics counts consistency**
    - Generate arrays of startup objects with random status values from the allowed set; run the aggregation logic, assert sum of per-status counts equals array length
    - Generate random interest arrays with mixed signal types; assert "my interests" count equals filtered count for `interested` + `committed`
    - **Validates: Requirements 7.1, 4.4, 7.6**

- [ ] 7. Build `PortfolioAnalytics` shared component
  - [ ] 7.1 Create `components/portfolio/PortfolioAnalytics.tsx` as a client component
    - Accept `role: 'admin' | 'investor'` and optional `investorId?: string` props
    - Use `usePortfolioAnalytics(role, investorId)` hook
    - Render four status stat cards (pending / active / waitlisted / rejected)
    - Render sector distribution `BarChart` and stage distribution `BarChart`, each wrapped in `ResponsiveContainer`; add `aria-label` to each chart container
    - For investor role, render a "My Interests" count card (interested + committed)
    - Show a loading skeleton while data is fetching; show an inline error with a retry button on failure
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 7.6_
  - [ ] 7.2 Embed `<PortfolioAnalytics role="admin" />` as a section in `app/(dashboard)/admin/page.tsx`
    - Pass the authenticated user's ID; add the section below the existing stats grid
    - _Requirements: 7.7_
  - [ ] 7.3 Embed `<PortfolioAnalytics role="investor" investorId={user.id} />` as a section in `app/(dashboard)/investor/page.tsx`
    - _Requirements: 7.8_
  - [ ]* 7.4 Write unit tests for `PortfolioAnalytics`
    - Test that status breakdown cards render with correct counts from mock data
    - Test that two charts are rendered
    - Test that "My Interests" card is shown only for investor role
    - _Requirements: 7.1, 7.2, 7.3, 7.6_

- [ ] 8. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Build investor portfolio list view
  - [ ] 9.1 Create `app/(dashboard)/investor/portfolio/page.tsx` as a server component
    - Assert caller has `investor` role; redirect to `/login` if not
    - Fetch all startups (id, name, sector, stage, status) ordered by `created_at` descending
    - Pass data as `initialStartups` to `InvestorPortfolioList`
    - _Requirements: 5.1_
  - [ ] 9.2 Create `components/portfolio/InvestorPortfolioList.tsx` as a client component
    - Accept `initialStartups: StartupRow[]`
    - Implement client-side filtering: sector dropdown, stage dropdown, status dropdown, and name search input (case-insensitive)
    - Display each startup's name, sector, stage, and status badge
    - Clicking a row navigates to `/investor/portfolio/[id]`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [ ]* 9.3 Write property test for startup filter correctness (Property 6)
    - **Property 6: Startup filter correctness**
    - Generate random startup arrays and random filter values (search strings, sector, stage, status)
    - Apply the filter function; assert every result satisfies the predicate and no satisfying row is missing
    - Test case-insensitivity by generating mixed-case search strings
    - **Validates: Requirements 4.2, 4.3, 5.2, 5.3, 5.4, 5.5**

- [ ] 10. Build investor startup detail view
  - [ ] 10.1 Create `app/(dashboard)/investor/portfolio/[id]/page.tsx` as a server component
    - Assert caller has `investor` role
    - Fetch startup public fields only (name, sector, stage, elevator_pitch, target_market, competitive_advantage, revenue_model, active_round_name, funding_goal, round_status) — do NOT select `founder_id`, email, or full_name
    - Fetch the most recent `application_scores` record for the startup (team_score, market_score, traction_score, uniqueness_score, overall_comment)
    - Fetch the investor's existing `investor_interests` record for this startup if one exists
    - Pass all data to `InvestorStartupDetail`
    - Call `notFound()` if startup does not exist
    - _Requirements: 8.1, 8.2, 8.3, 8.5_
  - [ ] 10.2 Create `components/portfolio/InvestorStartupDetail.tsx` as a client component
    - Accept `startup: StartupPublicRow`, `latestAdminScore: AdminScoreRow | null`, `initialInterest: InvestorInterestRow | null`, `investorId: string`
    - Render startup public profile (name, sector, stage, elevator pitch, target market, competitive advantage, revenue model, funding round details)
    - Render read-only admin scores section (team, market, traction, uniqueness, comment) only when `latestAdminScore` is not null
    - Render interest tracking form: signal type selector (`watching` / `interested` / `committed`) and note textarea, pre-populated from `initialInterest`
    - On save, call `upsertInterestAction`; on remove, call `removeInterestAction`; update UI without full page reload
    - Do NOT render founder email or full name anywhere in this component
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  - [ ]* 10.3 Write property test for founder PII isolation (Property 7)
    - **Property 7: Founder PII isolation**
    - Generate random founder email addresses and full names
    - Render `InvestorStartupDetail` with those values present in the startup object
    - Assert the rendered output does not contain the email or full name string
    - **Validates: Requirements 8.5**
  - [ ]* 10.4 Write unit tests for `InvestorStartupDetail`
    - Test that admin scores section renders when `latestAdminScore` is provided
    - Test that admin scores section is hidden when `latestAdminScore` is null
    - Test that interest form pre-populates from `initialInterest`
    - _Requirements: 8.3, 8.6_

- [ ] 11. Enhance admin startup list with summary counts and search/filter
  - [ ] 11.1 Update `app/(dashboard)/admin/startups/StartupTable.tsx` to display summary count cards above the table (total, active, pending, waitlisted)
    - Derive counts from `initialStartups` prop; no additional fetch needed
    - _Requirements: 4.4_
  - [ ] 11.2 Add search input (name/sector, case-insensitive) and status filter dropdown to `StartupTable`
    - Filter is client-side against the `initialStartups` array
    - _Requirements: 4.2, 4.3_
  - [ ] 11.3 Verify the existing delete flow in `StartupTable` requires a confirmation step before calling `deleteStartupAction`
    - If no confirmation exists, add a confirmation dialog (e.g., `window.confirm` or a shadcn `AlertDialog`) before the delete call
    - _Requirements: 4.5, 4.6_

- [ ] 12. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Property tests use fast-check (minimum 100 iterations each)
- All server actions follow the `assertRoleAccess → validate → DB operation → revalidatePath → return { success }` pattern
- The `investor_read_scores` RLS policy must be applied in Supabase before the investor detail page will work
- Recharts `BarChart` components must be wrapped in `ResponsiveContainer`; chart containers need `aria-label` for accessibility
- The `startups` table must have replication enabled in the Supabase Dashboard for the Realtime subscription in `use-portfolio-analytics.ts` to fire
