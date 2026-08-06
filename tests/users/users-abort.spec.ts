import { expect, test } from '@playwright/test'

// Demonstrates how to simulate a network failure using route.abort().
test.describe('Users - route.abort()', () => {
  test('displays a network error when the request is aborted', async ({
    page,
  }) => {
    let intercepted = false

    // Abort the request to simulate a network failure.
    await page.route('**/users', async route => {
      intercepted = true
      await route.abort()
    })

    await page.goto('/')

    await expect(page.getByTestId('empty-state')).toHaveText(
      'No users loaded',
    )

    await page.getByTestId('load-users').click()

    // Educational assertion: verifies that the request was intercepted.
    expect(intercepted).toBe(true)

    // Verify the UI displays an error message indicating a network failure.
    await expect(page.getByTestId('error')).toBeVisible()

    await expect(page.getByTestId('error')).toContainText(
      'Network error: request could not be completed',
    )
  })
})