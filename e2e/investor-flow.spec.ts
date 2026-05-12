import { test, expect } from '@playwright/test'
import { loginAs, expectSidebarItems } from './helpers/test-utils'

test.describe('Investor Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'investor')
  })

  test('should load the investor dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/.*investor.*/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('should display sidebar with investor navigation items', async ({ page }) => {
    await expectSidebarItems(page, ['Dashboard', 'Discovery', 'Portfolio'])
  })

  test('should navigate to Discovery page', async ({ page }) => {
    await page.click('nav >> text="Discovery"')
    await expect(page).toHaveURL(/.*investor\/discovery.*/)
  })

  test('should navigate to Portfolio page', async ({ page }) => {
    await page.click('nav >> text="Portfolio"')
    await expect(page).toHaveURL(/.*investor\/portfolio.*/)
  })
})
