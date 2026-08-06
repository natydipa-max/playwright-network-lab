import { expect, test } from '@playwright/test'

test.describe('Users - route.fetch() + route.fulfill()', () => {
  test('displays modified users without calling the real backend', async ({
    page,
  }) => {
    let intercepted = false

    // Promise that resolves when the route handler finishes processing.
    let resolveRouteHandled: () => void
    const routeHandled = new Promise<void>(resolve => {
      resolveRouteHandled = resolve
    })

    await page.route('**/users', async route => {
      const response = await route.fetch()
      const users = await response.json()

      users[0].name = 'Playwright'
      users[0].role = 'QA'

      intercepted = true

      await route.fulfill({ response, json: users })
      resolveRouteHandled()
    })

    await page.goto('/')

    await expect(page.getByTestId('empty-state')).toHaveText(
      'No users loaded',
    )

    await page.getByTestId('load-users').click()
    await routeHandled // <- Wait for the handler to finish BEFORE asserting

    // Educational assertion: verifies that the request was intercepted.
    expect(intercepted).toBe(true)

    // Verify the UI displays the modified users after the request completes successfully.
    await expect(page.getByTestId('user-list')).toBeVisible()
    await expect(page.getByTestId('user-1')).toHaveText('Playwright QA')
    await expect(page.getByTestId('user-2')).toHaveText('Mary ADMIN')
  })
})