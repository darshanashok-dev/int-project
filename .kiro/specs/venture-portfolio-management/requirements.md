# Requirements Document

## Introduction

The Venture Portfolio Management feature extends the existing Polaris platform to give admins and investors a structured, role-appropriate workflow for reviewing startup applications, approving or rejecting ventures, and tracking the overall portfolio health over time.

The system already has a startup table with basic status management for admins. This feature formalises and expands that into a full portfolio management experience: richer review workflows for admins, a dedicated portfolio view for investors with interest-tracking and scoring, and a portfolio analytics dashboard that surfaces key metrics across all ventures.

## Glossary

- **Admin**: A platform user with the `admin` role who has full oversight and decision-making authority over all startups and applications.
- **Investor**: A platform user with the `investor` role who can browse the portfolio, express interest in startups, and view portfolio analytics.
- **Startup**: A venture registered on the platform by a Founder, represented by a row in the `startups` table.
- **Application**: A formal submission linking a Startup to a Program, represented by a row in the `applications` table.
- **Portfolio**: The full collection of Startups tracked within the platform, regardless of status.
- **Review**: The act of an Admin evaluating a Startup's profile and updating its status and/or adding a scored note via `application_scores`.
- **Application_Score**: A record in the `application_scores` table capturing numeric scores (team, market, traction, uniqueness) and a qualitative comment for a given application. Scores are visible to Admins (read/write) and Investors (read-only).
- **Investor_Interest**: A record in the `investor_interests` table capturing an Investor's signal type and note against a specific Startup.
- **Status**: The current lifecycle state of a Startup — one of `pending`, `active`, `waitlisted`, or `rejected`.
- **Portfolio_Dashboard**: The analytics view available to Admins and Investors showing aggregate portfolio metrics.
- **Signal_Type**: A categorical label on an Investor_Interest record indicating the nature of the investor's interest (e.g., `watching`, `interested`, `committed`).

---

## Requirements

### Requirement 1: Startup Application Review

**User Story:** As an admin, I want to review a startup's full profile and application details in one place, so that I can make an informed approval decision.

#### Acceptance Criteria

1. WHEN an Admin navigates to a startup's detail page, THE Review_Page SHALL display the startup's name, sector, stage, founded date, elevator pitch, strategy summary, target market, competitive advantage, and revenue model.
2. WHEN an Admin navigates to a startup's detail page, THE Review_Page SHALL display the count of submitted applications and the status of the most recent application.
3. WHEN an Admin navigates to a startup's detail page and a prior review note exists, THE Review_Page SHALL display the most recent review note and the timestamp it was saved.
4. WHEN an Admin navigates to a startup's detail page, THE Review_Page SHALL display the startup's active funding round name, funding goal, and round status.
5. WHEN an Admin navigates to a startup's detail page, THE Review_Page SHALL display the founder's full name and email address.

---

### Requirement 2: Startup Status Management

**User Story:** As an admin, I want to approve, reject, waitlist, or mark a startup as pending, so that I can control which ventures progress through the program.

#### Acceptance Criteria

1. WHEN an Admin selects a new status for a Startup, THE Status_Manager SHALL update the startup's `status` field to one of `active`, `pending`, `waitlisted`, or `rejected`.
2. WHEN an Admin submits a status change, THE Status_Manager SHALL persist the change to the database and reflect the updated status in the UI without a full page reload.
3. IF an Admin submits a status value that is not one of the four allowed values, THEN THE Status_Manager SHALL return an error and leave the startup's status unchanged.
4. WHEN an Admin updates a startup's status from the list view, THE Startup_Table SHALL update the displayed status badge for that row immediately upon success.
5. THE Status_Manager SHALL restrict status update operations to users with the `admin` role.

---

### Requirement 3: Scored Review Notes

**User Story:** As an admin, I want to record numeric scores and qualitative notes against a startup's application directly within the existing review panel, so that I can document my evaluation rationale and compare startups objectively without leaving the startup detail page.

#### Acceptance Criteria

1. WHEN an Admin saves a review note for a Startup, THE Review_Manager SHALL associate the note with the most recent application for that startup via an `application_scores` record.
2. WHEN an Admin saves a review note, THE Review_Manager SHALL record the reviewer's user ID and the timestamp of the review.
3. WHEN an Admin provides numeric scores (team, market, traction, uniqueness) alongside a note, THE Review_Manager SHALL persist all four score fields and the qualitative comment in a single `application_scores` record.
4. IF an Admin attempts to save a review note with an empty comment field, THEN THE Review_Manager SHALL reject the submission and display a validation error.
5. IF no application exists for a Startup when an Admin attempts to save a review note, THEN THE Review_Manager SHALL return a descriptive error indicating that no application was found.
6. WHEN an Admin views a startup's detail page, THE Review_Page SHALL display the scored review form (team, market, traction, uniqueness score inputs and comment field) inline within the existing review panel — not as a separate page or modal flow.
7. WHEN an Admin views a startup's detail page, THE Review_Page SHALL display the most recently saved scores (team, market, traction, uniqueness) alongside the qualitative comment within the same review panel.

---

### Requirement 4: Portfolio List View for Admins

**User Story:** As an admin, I want to see all startups in a filterable, searchable table, so that I can quickly find and act on ventures that need attention.

#### Acceptance Criteria

1. THE Startup_Table SHALL display all startups with their name, founder email, sector, stage, status, and creation date.
2. WHEN an Admin enters text in the search field, THE Startup_Table SHALL filter the displayed rows to those whose name or sector contains the search text (case-insensitive).
3. WHEN an Admin selects a status from the filter dropdown, THE Startup_Table SHALL display only startups matching that status.
4. THE Startup_Table SHALL display summary counts for total ventures, active ventures, pending-review ventures, and waitlisted ventures above the table.
5. WHEN an Admin deletes a startup, THE Startup_Table SHALL remove the row from the displayed list upon success and require a confirmation step before deletion.
6. THE Startup_Table SHALL restrict delete and status-change operations to users with the `admin` role.

---

### Requirement 5: Investor Portfolio View

**User Story:** As an investor, I want to browse all startups in the portfolio and filter by sector, stage, and status, so that I can identify ventures that match my investment thesis.

#### Acceptance Criteria

1. WHEN an Investor navigates to the portfolio view, THE Investor_Portfolio_View SHALL display all startups with their name, sector, stage, and current status.
2. WHEN an Investor selects a sector filter, THE Investor_Portfolio_View SHALL display only startups matching the selected sector.
3. WHEN an Investor selects a stage filter, THE Investor_Portfolio_View SHALL display only startups matching the selected stage.
4. WHEN an Investor selects a status filter, THE Investor_Portfolio_View SHALL display only startups with the selected status.
5. WHEN an Investor enters text in the search field, THE Investor_Portfolio_View SHALL filter displayed startups to those whose name contains the search text (case-insensitive).
6. WHEN an Investor clicks on a startup in the portfolio view, THE Investor_Portfolio_View SHALL navigate to a startup detail page showing the startup's public profile information.

---

### Requirement 6: Investor Interest Tracking

**User Story:** As an investor, I want to mark startups with a signal type and add a note, so that I can track which ventures I am watching, interested in, or committed to.

#### Acceptance Criteria

1. WHEN an Investor selects a signal type for a Startup, THE Interest_Tracker SHALL create or update an `investor_interests` record linking the investor's user ID to the startup with the chosen signal type.
2. THE Interest_Tracker SHALL support the following signal types: `watching`, `interested`, and `committed`.
3. WHEN an Investor adds a note to an interest record, THE Interest_Tracker SHALL persist the note text alongside the signal type in the `investor_interests` record.
4. WHEN an Investor views their interests list, THE Interest_Tracker SHALL display each tracked startup's name, sector, stage, signal type, and note.
5. WHEN an Investor removes interest in a Startup, THE Interest_Tracker SHALL delete the corresponding `investor_interests` record.
6. THE Interest_Tracker SHALL restrict read and write access to the investor's own interest records.

---

### Requirement 7: Portfolio Analytics Dashboard

**User Story:** As an admin or investor, I want to see aggregate portfolio metrics embedded within my existing dashboard, so that I can understand the overall health and composition of the venture pipeline without navigating to a separate page.

#### Acceptance Criteria

1. THE Portfolio_Dashboard SHALL display the total number of startups broken down by status (`pending`, `active`, `waitlisted`, `rejected`).
2. THE Portfolio_Dashboard SHALL display the distribution of startups by sector as a chart.
3. THE Portfolio_Dashboard SHALL display the distribution of startups by stage as a chart.
4. WHEN the underlying startup data changes, THE Portfolio_Dashboard SHALL reflect the updated counts within the same page session without requiring a manual refresh.
5. THE Portfolio_Dashboard SHALL restrict access to users with the `admin` or `investor` role.
6. WHERE an Investor is viewing the Portfolio_Dashboard, THE Portfolio_Dashboard SHALL additionally display the count of startups the investor has marked as `interested` or `committed`.
7. WHEN an Admin views the admin dashboard, THE Portfolio_Dashboard SHALL be rendered as an embedded section within the existing admin dashboard page — not as a separate top-level route.
8. WHEN an Investor views the investor dashboard, THE Portfolio_Dashboard SHALL be rendered as an embedded section within the existing investor dashboard page — not as a separate top-level route.

---

### Requirement 8: Startup Detail View for Investors

**User Story:** As an investor, I want to view a startup's public profile including its pitch, market details, funding status, and admin review scores, so that I can make a well-informed evaluation before expressing interest.

#### Acceptance Criteria

1. WHEN an Investor navigates to a startup's detail page, THE Startup_Detail_View SHALL display the startup's name, sector, stage, elevator pitch, target market, competitive advantage, and revenue model.
2. WHEN an Investor navigates to a startup's detail page, THE Startup_Detail_View SHALL display the startup's active funding round name, funding goal, and round status.
3. WHEN an Investor navigates to a startup's detail page, THE Startup_Detail_View SHALL display the investor's current signal type and note for that startup if an interest record exists.
4. WHEN an Investor updates their signal type or note from the startup detail page, THE Startup_Detail_View SHALL persist the change via the Interest_Tracker and reflect the updated state in the UI without a full page reload.
5. THE Startup_Detail_View SHALL not expose the founder's personal contact details (email, full name) to Investor users.
6. WHEN an Investor navigates to a startup's detail page and an `application_scores` record exists for that startup, THE Startup_Detail_View SHALL display the most recent admin review scores (team, market, traction, uniqueness) and the qualitative comment in a read-only section of the page.
