import { test, expect } from '@playwright/test'

test.describe('Create stream form', () => {
  test('shows connect-wallet gate on create page', async ({ page }) => {
    await page.goto('/app/create')
    await expect(
      page.locator('text=Connect your wallet').or(page.locator('text=Connect wallet')).first(),
    ).toBeVisible()
  })

  test('create page has correct title in head', async ({ page }) => {
    await page.goto('/app/create')
    await expect(page).toHaveTitle(/Dashboard|FlowStar/)
  })
})
