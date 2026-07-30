import type { User } from '../types/user'
const API_URL = import.meta.env.VITE_API_URL

export async function getUsers(): Promise<User[]> {

  if (!API_URL) {
    throw new Error('VITE_API_URL is not defined')
}  
  const response = await fetch(`${API_URL}/users`)

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  return response.json()
}