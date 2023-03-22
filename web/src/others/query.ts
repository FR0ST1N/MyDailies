import { QueryClient } from '@tanstack/react-query'
import {
  EntryResponse,
  EntryQueryParams,
  UserResponse,
  HabitResponse,
  HomeCardResponse,
} from './types'
import { apiFetch } from './api'

export const queryClient = new QueryClient()

export const entriesQuery = (entry: EntryQueryParams) => ({
  queryKey: ['entries', entry.id, { year: entry.year, month: entry.month }],
  queryFn: async () =>
    apiFetch<null, EntryResponse[]>(
      `/api/habit/${entry.id}/entry?year=${entry.year}&month=${
        entry.month + 1
      }`,
      'GET',
      null
    ),
})

export const userQuery = () => ({
  queryKey: ['user'],
  queryFn: async () => apiFetch<null, UserResponse>(`/api/user`, 'GET', null),
})

export const habitQuery = (id: string) => ({
  queryKey: ['habit', id],
  queryFn: async () =>
    apiFetch<null, HabitResponse>(`/api/habit/${id}`, 'GET', null),
})

export const habitsQuery = () => ({
  queryKey: ['habits'],
  queryFn: async () =>
    apiFetch<null, HomeCardResponse[]>('/api/habit/all', 'GET', null),
})

export const usersQuery = () => ({
  queryKey: ['users'],
  queryFn: async () =>
    apiFetch<null, UserResponse[]>('/api/user/all', 'GET', null),
})
