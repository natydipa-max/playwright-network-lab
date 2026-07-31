const API_URL = import.meta.env.VITE_API_URL

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {

  if (!API_URL) {
    throw new Error('VITE_API_URL is not defined')
  }

  const response = await fetch(`${API_URL}${endpoint}`, options)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}