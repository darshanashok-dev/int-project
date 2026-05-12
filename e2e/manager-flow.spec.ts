import { test, expect } from '@playwright/test'
import { loginAs, expectSidebarItems } from './helpers/test-utils'

test.describe('Manager Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'manager')
  })

  test('should load the manager dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/.*manager.*/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('should display sidebar with manager navigation items', async ({ page }) => {
    await expectSidebarItems(page, ['Dashboard', 'Programs', 'Startups'])
  })

  test('should navigate to Programs page', async ({ page }) => {
    await page.click('nav >> text="Programs"')
    await expect(page).toHaveURL(/.*manager\/programs.*/)
  })

  test('should navigate to Startups page', async ({ page }) => {
    await page.click('nav >> text="Startups"')
    await expect(page).toHaveURL(/.*manager\/startups.*/)
  })
})
