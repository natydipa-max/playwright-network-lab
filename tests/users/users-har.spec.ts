import { expect, test } from '@playwright/test'

// Demonstrates how to replay previously recorded HTTP traffic
// using routeFromHAR(). No real request reaches the backend.
test.describe('Users - routeFromHAR()', () => {
  test('loads users from a recorded HAR file', async ({ page }) => {
    await page.routeFromHAR('har/users.har')

    await page.goto('/')

    await expect(page.getByTestId('empty-state')).toHaveText(
      'No users loaded',
    )

    await page.getByTestId('load-users').click()

    // Verify the UI displays the loaded users after the request completes successfully.
    await expect(page.getByTestId('user-list')).toBeVisible()

    await expect(page.getByTestId('user-1')).toHaveText('John USER')
    await expect(page.getByTestId('user-2')).toHaveText('Mary ADMIN')
  })
})