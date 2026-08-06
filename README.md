# Playwright Network Lab

Learn Playwright Network Interception through real, runnable examples.

Instead of isolated code snippets, this project demonstrates how Playwright's routing APIs behave in a real React + Express application, helping QA Engineers understand when and why to use each interception strategy.

```text
Playwright Tests
        │
        ▼
React Frontend
        │
HTTP Requests
        │
        ▼
Express Backend
```

Depending on the scenario, Playwright intercepts, modifies, mocks, aborts, delays, or replays requests before they reach the backend.

---

## Interception Techniques Covered

This project demonstrates:

- ✅ Real API communication
- ✅ Response mocking with `route.fulfill()`
- ✅ HTTP error simulation
- ✅ Empty API responses
- ✅ Network latency simulation
- ✅ Request abortion with `route.abort()`
- ✅ Request modification with `route.continue()`
- ✅ Response modification with `route.fetch()` + `route.fulfill()`
- ✅ Chaining multiple route handlers with `route.fallback()`
- ✅ HTTP replay using `routeFromHAR()`

---

## Tech Stack

- React
- TypeScript
- Vite
- Express
- Playwright

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/natydipa-max/playwright-network-lab.git
cd playwright-network-lab
```

### Configure environment variables

```bash
cp frontend/.env.example frontend/.env
```

> **Note**
>
> The `.env` file is ignored by Git and should never be committed.

---

### Install dependencies

Frontend

```bash
cd frontend
npm install
```

Backend

```bash
cd ../backend
npm install
```

Tests

```bash
cd ../tests
npm install
```

---

## Running the application

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Application URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## Running the tests

Run the complete test suite:

```bash
cd tests
npx playwright test
```

Run an individual scenario:

```bash
npx playwright test users/users-abort.spec.ts
```

Example:

```bash
npx playwright test users/users-fallback.spec.ts
```

---

# Network Interception Scenarios

| Test | Playwright API | Purpose |
|------|----------------|---------|
| `users.spec.ts` | Real API | Baseline communication with the backend |
| `users-fulfill.spec.ts` | `route.fulfill()` | Mock a successful API response |
| `users-error.spec.ts` | `route.fulfill()` | Simulate an HTTP 500 error |
| `users-empty.spec.ts` | `route.fulfill()` | Return an empty list of users |
| `users-delay.spec.ts` | `route.continue()` | Simulate network latency while using the real backend |
| `users-abort.spec.ts` | `route.abort()` | Simulate a network failure |
| `users-continue.spec.ts` | `route.continue()` | Modify outgoing request headers before reaching the backend |
| `users-modify.spec.ts` | `route.fetch()` + `route.fulfill()` | Modify a real backend response before returning it to the browser |
| `users-fallback.spec.ts` | `route.fallback()` | Chain multiple route handlers before sending the request |
| `users-har.spec.ts` | `routeFromHAR()` | Replay previously recorded HTTP traffic without contacting the backend |

---

## Project Structure

```
playwright-network-lab/
│
├── frontend/
├── backend/
└── tests/
    ├── har/
    │   └── users.har
    │
    └── users/
        ├── users.spec.ts
        ├── users-fulfill.spec.ts
        ├── users-error.spec.ts
        ├── users-empty.spec.ts
        ├── users-delay.spec.ts
        ├── users-abort.spec.ts
        ├── users-continue.spec.ts
        ├── users-modify.spec.ts
        ├── users-fallback.spec.ts
        └── users-har.spec.ts
```

---

## Future Improvements

Possible future scenarios include:

## Future Scenarios

- Authentication flows
- Token refresh
- Request retries
- File uploads
- GraphQL interception (optional)

---

## Example: route.fallback()

The following example shows how multiple route handlers can participate in processing the same request.

```text

            Browser
                │
                │ GET /users
                ▼
┌─────────────────────────────────────┐
│ Handler #1                          │
│                                     │
│ Add custom header                   │
│ x-qa-test: playwright-network-lab   │
│                                     │
│ route.fallback()                    │
└─────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Handler #2                          │
│                                     │
│ Verify custom header                │
│                                     │
│ route.continue()                    │
└─────────────────────────────────────┘
                 │
                 ▼
         Express Backend
                 │
                 ▼
         HTTP 200 Response
                 │
                 ▼
             Browser
```
## Troubleshooting: `webServer` timeout with multiple services

### Problem

Playwright timed out waiting for the configured `webServer`:

```text
Error: Timed out waiting 60000ms from config.webServer.
```

The project was configured to start both the backend and frontend:

```ts
webServer: [
  {
    name: 'Backend',
    command: 'npm run dev',
    cwd: '../backend',
    url: 'http://localhost:3000',
  },
  {
    name: 'Frontend',
    command: 'npm run dev',
    cwd: '../frontend',
    url: 'http://localhost:5173',
  },
]
```

Only the backend started. The frontend was never launched.

### Root cause

Although the backend process started successfully, the configured health check URL returned **404 Not Found**:

```text
GET http://localhost:3000 → 404 Not Found
```

The actual API endpoint was:

```text
GET http://localhost:3000/users → 200 OK
```

Because Playwright did not consider the backend ready, it never started the second `webServer`, eventually timing out.

### Solution

Configure `webServer.url` to point to an endpoint that returns a successful response.

```ts
webServer: [
  {
    name: 'Backend',
    command: 'npm run dev',
    cwd: '../backend',
    url: 'http://localhost:3000/users',
  },
  {
    name: 'Frontend',
    command: 'npm run dev',
    cwd: '../frontend',
    url: 'http://localhost:5173',
  },
]
```

An even better approach is to expose a dedicated health endpoint:

```ts
app.get('/health', (_, res) => {
  res.sendStatus(200);
});
```

Then configure:

```ts
url: 'http://localhost:3000/health'
```

### Lessons learned

- A running process does not necessarily mean Playwright considers the server **ready**.
- Always configure `webServer.url` to a valid endpoint that returns a successful HTTP response.
- A dedicated `/health` endpoint is preferable to using an application endpoint, since it clearly represents server readiness and is less likely to change as the application evolves.