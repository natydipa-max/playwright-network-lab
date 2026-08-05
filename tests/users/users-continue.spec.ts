import { expect, test } from '@playwright/test'

// Demonstrates how to modify an outgoing request using route.continue().
test.describe('Users - route.continue()', () => {
  test('modifies the outgoing request before it reaches the real backend', async ({
    page,
  }) => {
    let intercepted = false

    // Synchronize the test with the asynchronous route handler.
    // page.route() does not automatically wait for the handler to finish.
    let resolveRouteHandled!: () => void
    const routeHandled = new Promise<void>(resolve => {
      resolveRouteHandled = resolve
    })

    await page.route('**/users', async route => {
      try {
        intercepted = true

        await route.continue({
          headers: {
            ...route.request().headers(),
            'x-qa-test': 'playwright-network-lab',
          },
        })
      } finally {
        resolveRouteHandled()
      }
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

    await routeHandled

    // Educational assertion: verifies that the request was intercepted.
    // In production tests, asserting the rendered UI is usually sufficient.
    expect(intercepted).toBe(true)

    const response = await responsePromise

    // Verify that the outgoing request was modified before reaching the backend.
    expect(
      response.request().headers()['x-qa-test'],
    ).toBe('playwright-network-lab')

    // The response comes from the real backend.
    expect(response.status()).toBe(200)

    await expect(page.getByTestId('user-list')).toBeVisible()

    await expect(page.getByTestId('user-1')).toHaveText('John USER')
    await expect(page.getByTestId('user-2')).toHaveText('Mary ADMIN')
  })
})