# Playwright Network Lab

Hands-on learning project focused on mastering Playwright network interception by building and testing a real React + Express application from scratch.

## What You'll Learn

- Build a small React application
- Build a lightweight Express API
- Intercept HTTP requests with Playwright
- Mock API responses
- Simulate network failures
- Test loading states
- Debug network traffic

## Tech Stack

- React
- TypeScript
- Vite
- Express
- Playwright

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/natydipa-max/playwright-network-lab.git
cd playwright-network-lab
```

### 2. Configure environment variables

Copy the example environment file:

```bash
cp frontend/.env.example frontend/.env
```

> **Note**
>
> Copy `.env.example` to `.env` before running the project.
> The `.env` file is ignored by Git and should not be committed.

### 3. Install dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 4. Start the backend

```bash
npm run dev
```

### 5. Start the frontend

```bash
cd ../frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Planned Scenarios

- Basic API communication
- Request interception
- Response mocking
- Network latency simulation
- HTTP error simulation
- Request modification
- Authentication flows
- GraphQL interception (optional)

## Status

🚧 In progress