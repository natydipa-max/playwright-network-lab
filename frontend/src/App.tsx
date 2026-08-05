import { useState } from 'react'

import './App.css'

import { getUsers } from './api/users'
import type { User } from './types/user'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  async function handleLoadUsers() {
    setLoading(true)
    setError(null)

    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      if (err instanceof TypeError) {
        setError('Network error: request could not be completed')
      } else {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    } finally {
      setHasLoaded(true)
      setLoading(false)
    }
  }

  const showInitialState =
    !loading && !error && !hasLoaded

  const showEmptyState =
    !loading && !error && hasLoaded && users.length === 0

  const showUsers =
    users.length > 0

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

      {loading && (
        <p data-testid="loading">Loading users...</p>
      )}

      {error && (
      <p data-testid="error">{error}</p>
    )}

    {showInitialState && (
      <p data-testid="empty-state">No users loaded</p>
    )}

    {showEmptyState && (
      <p data-testid="empty-state">No users found</p>
    )}

    {showUsers && (
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