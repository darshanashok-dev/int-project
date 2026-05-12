import { test, expect } from '@playwright/test'
import { loginAs, expectSidebarItems } from './helpers/test-utils'

test.describe('Founder Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'founder')
  })

  test('should load the founder dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/.*founder.*/)
    // Dashboard should have main content area
    await expect(page.locator('main')).toBeVisible()
  })

  test('should display sidebar with founder navigation items', async ({ page }) => {
    await expectSidebarItems(page, ['Dashboard', 'Apply', 'Milestones', 'My Startup'])
  })

  test('should navigate to Apply page', async ({ page }) => {
    await page.click('nav >> text="Apply"')
    await expect(page).toHaveURL(/.*founder\/apply.*/)
  })

  test('should navigate to Milestones page', async ({ page }) => {
    await page.click('nav >> text="Milestones"')
    await expect(page).toHaveURL(/.*founder\/milestones.*/)
  })

  test('should navigate to My Startup page', async ({ page }) => {
    await page.click('nav >> text="My Startup"')
    await expect(page).toHaveURL(/.*founder\/startup.*/)
  })

  test('should display the Polaris branding in sidebar', async ({ page }) => {
    await expect(page.locator('text=Polaris').first()).toBeVisible()
  })
})
