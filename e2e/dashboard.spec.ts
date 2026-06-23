import { test, expect } from '@playwright/test'

test.describe('Dashboard (app)', () => {
  test('shows connect-wallet prompt when not connected', async ({ page }) => {
    await page.goto('/app')
    await expect(
      page.locator('text=Connect your wallet').or(page.locator('text=Connect wallet')).first(),
    ).toBeVisible()
  })

  test('connect wallet dialog opens', async ({ page }) => {
    await page.goto('/app')
    await page.locator('text=Connect wallet').first().click()
    await expect(page.locator('text=Freighter')).toBeVisible()
    await expect(page.locator('text=xBull')).toBeVisible()
  })
})
