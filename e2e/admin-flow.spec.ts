import { test, expect } from '@playwright/test'
import { loginAs, expectSidebarItems } from './helpers/test-utils'

test.describe('Admin Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
  })

  test('should load the admin dashboard overview', async ({ page }) => {
    await expect(page).toHaveURL(/.*admin.*/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('should display sidebar with admin navigation items', async ({ page }) => {
    await expectSidebarItems(page, ['Overview', 'Users', 'Startups', 'Programs', 'Applications', 'Reports'])
  })

  test('should navigate to Users management page', async ({ page }) => {
    await page.click('nav >> text="Users"')
    await expect(page).toHaveURL(/.*admin\/users.*/)
  })

  test('should navigate to Startups page', async ({ page }) => {
    await page.click('nav >> text="Startups"')
    await expect(page).toHaveURL(/.*admin\/startups.*/)
  })

  test('should navigate to Programs page', async ({ page }) => {
    await page.click('nav >> text="Programs"')
    await expect(page).toHaveURL(/.*admin\/programs.*/)
  })

  test('should navigate to Applications page', async ({ page }) => {
    await page.click('nav >> text="Applications"')
    await expect(page).toHaveURL(/.*admin\/applications.*/)
  })

  test('should navigate to Reports page', async ({ page }) => {
    await page.click('nav >> text="Reports"')
    await expect(page).toHaveURL(/.*admin\/reports.*/)
  })
})
