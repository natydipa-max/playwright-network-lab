import type { User } from '../types/user'
import { apiClient } from './client'

export async function getUsers(): Promise<User[]> {
  return apiClient<User[]>('/users')
}