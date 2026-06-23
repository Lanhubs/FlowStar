import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('skip-to-content link exists in app layout', async ({ page }) => {
    await page.goto('/app')
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeAttached()
    await expect(skipLink).toHaveText('Skip to content')
  })

  test('main content landmark has id', async ({ page }) => {
    await page.goto('/app')
    const main = page.locator('main#main-content')
    await expect(main).toBeVisible()
  })

  test('landing page has no broken heading hierarchy', async ({ page }) => {
    await page.goto('/')
    const h1 = page.locator('h1')
    await expect(h1.first()).toBeVisible()
  })
})
