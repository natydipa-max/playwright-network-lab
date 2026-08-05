import { expect, test } from '@playwright/test'

// Demonstrates how to mock an empty API response using route.fulfill().
test.describe('Users - route.fulfill() - Empty response', () => {
  test('displays an empty state when the API returns no users', async ({
    page,
  }) => {
    
    let intercepted = false

    // Return an empty users collection instead of forwarding the request.
    await page.route('**/users', async route => {
      intercepted = true
      await route.fulfill({
        status: 200,
        json: [],
      })
    })

    await page.goto('/')

    await expect(page.getByTestId('empty-state')).toHaveText(
      'No users loaded',
    )

    await page.getByTestId('load-users').click()

    // Educational assertion: verifies that the request was intercepted.
    // In production tests, asserting the rendered UI is usually sufficient.
    expect(intercepted).toBe(true)

    await expect(page.locator('[data-testid^="user-"]')).toHaveCount(0)
    await expect(page.getByTestId('user-list')).not.toBeVisible()
    await expect(page.getByTestId('empty-state')).toHaveText(
      'No users found',
    )
  })
})