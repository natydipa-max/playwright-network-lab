import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './',

  use: {
    baseURL: 'http://localhost:5173',
  },

  webServer: [
  {
    name: 'Backend',
    command: 'npm run dev',
    cwd: '../backend',
    url: 'http://localhost:3000/health',
    reuseExistingServer: true,
  },
  {
    name: 'Frontend',
    command: 'npm run dev',
    cwd: '../frontend',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
],
})