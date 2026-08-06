import { expect, test } from '@playwright/test'

// Demonstrates how to mock an error API response using route.fulfill().
test.describe('Users - route.fulfill() - 500 error', () => {
  test('displays an error message when the API returns 500', async ({
    page,
  }) => {
    
    let intercepted = false

    // Return a mocked response instead of forwarding the request to the backend.
    await page.route('**/users', async route => {
      intercepted = true
      // Respond with a mocked HTTP 500 error instead of forwarding the request.
      await route.fulfill({
        status: 500,
        json: {
          error: 'Internal Server Error',
        },
      })
    })

    await page.goto('/')

    await expect(page.getByTestId('empty-state')).toHaveText(
      'No users loaded',
    )

    await page.getByTestId('load-users').click()

    // Educational assertion: verifies that the request was intercepted.
    expect(intercepted).toBe(true)

    await expect(page.getByTestId('user-list')).not.toBeVisible()

    // Verify the UI displays an error message indicating a 500 error from the API.
    await expect(page.getByTestId('error')).toHaveText(
      'API error: 500',
    )
  })
})
        