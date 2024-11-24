export interface EntryResponse {
  id: number
  date: string
  created_at: string
}

export interface EntryQueryParams {
  id: number
  year: number
  month: number
}

export interface UserResponse {
  name: string
  email: string
  created_at: string
  admin: boolean
  timezone: string
}

export interface ChangePasswordRequest {
  password: string
  new_password: string
}

export interface PatchUserRequest {
  timezone?: string
}

export interface HabitResponse {
  name: string
  created_at: string
  id: number
  entries_count: number
  streak: number
  longest_streak: number
}

export interface HomeCardResponse {
  id: number
  name: string
  created_at: string
  last_activity: string
  completed_today: boolean
}

export interface AddHabitRequest {
  name: string
}

export interface TokenRequest {
  email: string
  password: string
}

export interface TokenResponse {
  token: string
}

export interface AddUserRequest {
  name: string
  email: string
  password: string
  admin: boolean
  timezone: string
}

export interface Payload {
  id: number
  name: string
  email: string
  admin: boolean
  exp: number
}

export interface UseAuthProviderReturnType {
  user: Payload | null
  login: (token: string) => void
  logout: () => void
}
