import { expect, test } from '@playwright/test'

// Baseline test using the real backend without request interception.
test.describe('Users - Real API', () => {
  test('loads and displays users from the real API', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('empty-state')).toHaveText(
      'No users loaded',
    )

    const [response] = await Promise.all([
      page.waitForResponse(response =>
        response.url().endsWith('/users') &&
        response.request().method() === 'GET',
      ),
      page.getByTestId('load-users').click(),
    ])

    expect(response.status()).toBe(200)

    await expect(page.getByTestId('user-list')).toBeVisible()

    await expect(page.getByTestId('user-1')).toHaveText('John USER')
    await expect(page.getByTestId('user-2')).toHaveText('Mary ADMIN')
  })
})