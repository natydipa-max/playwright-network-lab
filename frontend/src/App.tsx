import { useState } from 'react'

import './App.css'

import { getUsers } from './api/users'
import type { User } from './types/user'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLoadUsers() {
    setLoading(true)
    setError(null)

    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main data-testid="app">
      <h1 data-testid="title">Playwright Network Lab</h1>

      <p data-testid="description">
        Learn and experiment with Playwright Network Interception.
      </p>

      <button
        onClick={handleLoadUsers}
        disabled={loading}
        data-testid="load-users"
      >
        {loading ? 'Loading...' : 'Load Users'}
      </button>

      {error && (
        <p data-testid="error">{error}</p>
      )}

      {!error && users.length === 0 && !loading && (
        <p data-testid="empty-state">No users loaded</p>
      )}

      {users.length > 0 && (
        <ul data-testid="user-list">
          {users.map(user => (
            <li
              key={user.id}
              data-testid={`user-${user.id}`}
            >
              {user.name} {user.role}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App