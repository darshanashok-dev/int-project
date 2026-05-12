import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/test-utils'

test.describe('Authentication Flows', () => {
  test('should display the login page with correct elements', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h2')).toContainText('Sign In')
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should display role selection chips', async ({ page }) => {
    await page.goto('/login')
    for (const role of ['Founder', 'Admin', 'Mentor', 'Investor', 'Manager']) {
      await expect(page.locator('button[type="button"]', { hasText: role }).first()).toBeVisible()
    }
  })

  test('should populate demo credentials when quick-fill button is clicked', async ({ page }) => {
    await page.goto('/login')
    // Click the "Admin" demo button
    await page.locator('button', { hasText: 'Admin' }).last().click()
    await expect(page.locator('#email')).toHaveValue('admin@polaris.com')
    await expect(page.locator('#password')).toHaveValue('admin123')
  })

  test('should login as founder and reach the founder dashboard', async ({ page }) => {
    await loginAs(page, 'founder')
    await expect(page).toHaveURL(/.*founder.*/)
  })

  test('should login as admin and reach the admin dashboard', async ({ page }) => {
    await loginAs(page, 'admin')
    await expect(page).toHaveURL(/.*admin.*/)
  })

  test('should navigate to register page from login', async ({ page }) => {
    await page.goto('/login')
    await page.click('text=Create Account')
    await expect(page).toHaveURL(/.*register.*/)
    await expect(page.locator('h2')).toContainText('Join Polaris')
  })

  test('should display register form with role selector', async ({ page }) => {
    await page.goto('/register')
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.locator('#role')).toBeVisible()
  })

  test('should redirect unauthenticated users from protected routes', async ({ page }) => {
    // Clear any cookies first
    await page.context().clearCookies()
    await page.goto('/admin')
    // Should end up at login
    await page.waitForURL('**/login**', { timeout: 10000 })
    await expect(page).toHaveURL(/.*login.*/)
  })
})
