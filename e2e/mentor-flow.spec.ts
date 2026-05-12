import { test, expect } from '@playwright/test'
import { loginAs, expectSidebarItems } from './helpers/test-utils'

test.describe('Mentor Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'mentor')
  })

  test('should load the mentor dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/.*mentor.*/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('should display sidebar with mentor navigation items', async ({ page }) => {
    await expectSidebarItems(page, ['Dashboard', 'Sessions', 'Portfolio'])
  })

  test('should navigate to Sessions page', async ({ page }) => {
    await page.click('nav >> text="Sessions"')
    await expect(page).toHaveURL(/.*mentor\/sessions.*/)
  })

  test('should navigate to Portfolio page', async ({ page }) => {
    await page.click('nav >> text="Portfolio"')
    await expect(page).toHaveURL(/.*mentor\/startups.*/)
  })
})
