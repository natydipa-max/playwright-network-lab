import { expect, test } from '@playwright/test'

// Demonstrates how to simulate network latency using route.continue().
test.describe('Users - route.continue() - Delayed response', () => {
  test('displays a loading state while waiting for a delayed response', async ({
    page,
  }) => {
    let intercepted = false

    await page.route('**/users', async route => {
      intercepted = true

      // Simulate a slow network before returning the response.
      await new Promise(resolve => setTimeout(resolve, 2000))

      await route.continue()
    })

    await page.goto('/')

    await expect(page.getByTestId('empty-state')).toHaveText(
      'No users loaded',
    )

    const responsePromise = page.waitForResponse(response =>
        response.url().endsWith('/users') &&
        response.request().method() === 'GET',
        )

    await page.getByTestId('load-users').click()

    // While waiting, the UI should indicate that the request is in progress.
    await expect(page.getByTestId('loading')).toHaveText('Loading users...')

    // Educational assertion: verifies that the request was intercepted.
    expect(intercepted).toBe(true)

    const response = await responsePromise
    expect(response.status()).toBe(200)

    await expect(page.getByTestId('user-list')).toBeVisible()

    await expect(page.getByTestId('user-1')).toHaveText('John USER')
    await expect(page.getByTestId('user-2')).toHaveText('Mary ADMIN')
  })
})