import { Page } from '@playwright/test'

/**
 * Shared test utilities for Polaris E2E tests.
 * All flows run against NEXT_PUBLIC_MOCK_MODE=true.
 */

export type Role = 'admin' | 'founder' | 'mentor' | 'investor' | 'manager'

/**
 * Logs in as a specific role via the login page in mock mode.
 * Sets mock cookies and navigates to the role dashboard.
 */
export async function loginAs(page: Page, role: Role) {
  await page.goto('/login')

  // Fill credentials (any values work in mock mode)
  await page.fill('#email', `${role}@polaris.com`)
  await page.fill('#password', `${role}123`)

  // Select the role chip
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)
  // The role buttons are in a grid; click the one matching our role
  // Use .first() in case demo quick-fill buttons exist with the same text
  const roleButton = page.locator('button[type="button"]', { hasText: roleLabel }).first()
  if (await roleButton.isVisible()) {
    await roleButton.click()
  }

  // Submit
  await page.click('button[type="submit"]')

  // Wait for navigation to complete (should land on /{role})
  // Use longer timeout for initial Next.js lazy builds
  await page.waitForURL(`**/${role}**`, { timeout: 45000 })
}

/**
 * Asserts the sidebar contains the expected navigation items for a role.
 */
export async function expectSidebarItems(page: Page, items: string[]) {
  for (const item of items) {
    // Use a slightly relaxed locator — sidebar links contain the text
    await page.waitForSelector(`nav >> text="${item}"`, { timeout: 5000 })
  }
}
