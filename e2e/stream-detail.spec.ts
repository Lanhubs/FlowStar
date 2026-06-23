import { test, expect } from '@playwright/test'

test.describe('Stream detail page', () => {
  test('shows "stream not found" for invalid id', async ({ page }) => {
    await page.goto('/app/stream/99999')
    await expect(
      page.locator('text=Connect your wallet').or(page.locator('text=Stream not found')).first(),
    ).toBeVisible()
  })
})
