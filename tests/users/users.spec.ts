import { expect, test } from '@playwright/test'

test.describe('Users - Real API', () => {
  test('loads users from the backend', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('empty-state')).toHaveText(
      'No users loaded',
    )

    await page.getByTestId('load-users').click()

    const responsePromise = page.waitForResponse(
        'http://localhost:3000/users',
        )

    await page.getByTestId('load-users').click()

    const response = await responsePromise

    expect(response.status()).toBe(200)

    await expect(page.getByTestId('user-list')).toBeVisible()

    await expect(page.getByTestId('user-1')).toHaveText('John USER')
    await expect(page.getByTestId('user-2')).toHaveText('Mary ADMIN')
  })
})