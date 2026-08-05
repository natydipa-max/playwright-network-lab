import { expect, test } from '@playwright/test'

// Demonstrates how to mock an API response using route.fulfill().
// The request never reaches the real backend.
test.describe('Users - route.fulfill()', () => {
  test('displays mocked users without calling the real backend', async ({
    page,
  }) => {
    
    let intercepted = false

    // Return a mocked response instead of forwarding the request to the backend.
    await page.route('**/users', async route => {
      intercepted = true
      await route.fulfill({
        status: 200,
        json: [
          {
            id: 99,
            name: 'Playwright',
            role: 'QA',
          },
          {
            id: 100,
            name: 'Mock User',
            role: 'TEST',
          },
        ],
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

    await expect(page.getByTestId('user-list')).toBeVisible()

    await expect(page.getByTestId('user-99')).toHaveText('Playwright QA')
    await expect(page.getByTestId('user-100')).toHaveText('Mock User TEST')
  })
})