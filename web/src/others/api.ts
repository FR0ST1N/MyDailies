import { tokenName } from './auth'

const handleError = async (response: Response) => {
  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json')
  if (!response.ok) {
    const errorMessage = isJson
      ? (await response.json()).error
      : 'Unexpected error'
    return Promise.reject(errorMessage)
  }
  return isJson ? response.json() : response
}

export const apiFetch = async <T, U>(
  url: string,
  method: string,
  data: T
): Promise<U> => {
  // Get token
  const token = localStorage.getItem(tokenName)
  method = method.toUpperCase()
  // Set options based on type of method
  const options: RequestInit = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }
  if (method === 'HEAD' || method === 'GET') {
    options.body = null
    options.headers = { Authorization: `Bearer ${token}` }
  }
  // Fetch
  const response = await fetch(url, options)
  // Error stuff
  return handleError(response)
}
