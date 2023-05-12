import { QueryClient } from '@tanstack/react-query'
import { ActionFunctionArgs, redirect } from 'react-router-dom'
import { apiFetch } from '../others/api'
import {
  entriesQuery,
  userQuery,
  habitQuery,
  habitsQuery,
  usersQuery,
} from '../others/query'
import { getEntryRequestObject } from '../others/helper'
import toast from 'react-hot-toast'
import { invalidHabitId } from '../others/consts'
import {
  ChangePasswordRequest,
  PatchUserRequest,
  AddHabitRequest,
  TokenRequest,
  TokenResponse,
  AddUserRequest,
} from '../others/types'
import { getTimezoneFromString } from '../others/timezone'

export const calendarAction =
  (queryClient: QueryClient) =>
  async ({ params }: ActionFunctionArgs) => {
    const id = params.habitId
    if (id === undefined) {
      throw invalidHabitId
    }
    const res = await apiFetch<null, unknown>(
      `/api/habit/${id}/entry`,
      'POST',
      null
    )
    queryClient.invalidateQueries(
      entriesQuery(getEntryRequestObject(id)).queryKey
    )
    queryClient.invalidateQueries(habitQuery(id).queryKey)
    toast('Checked-in for today', { icon: '🎉' })
    return res
  }

export const deleteModalAction =
  (queryClient: QueryClient) =>
  async ({ params }: ActionFunctionArgs) => {
    const id = params.habitId as string
    await apiFetch<null, unknown>(`/api/habit/${id}`, 'DELETE', null)
    // Remove
    queryClient.removeQueries(habitQuery(id).queryKey)
    queryClient.removeQueries(['entries', +id])
    // Invalidate
    queryClient.invalidateQueries(habitsQuery().queryKey)

    toast('Deleted habit', { icon: '🗑️' })
    // Return home
    return redirect('/')
  }

export const accountAction =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    type ActionIntent = 'info' | 'password' | null
    const intent = formData.get('intent')?.toString() as ActionIntent
    if (intent === 'password') {
      const data: ChangePasswordRequest = {
        password: formData.get('password')?.toString() ?? '',
        new_password: formData.get('new-password')?.toString() ?? '',
      }
      const res = await apiFetch<ChangePasswordRequest, unknown>(
        '/api/user/password',
        'PATCH',
        data
      )
      return res
    } else if (intent === 'info') {
      const timezone = getTimezoneFromString(formData) ?? undefined
      const data: PatchUserRequest = {
        timezone: timezone,
      }
      const res = await apiFetch<PatchUserRequest, unknown>(
        '/api/user',
        'PATCH',
        data
      )
      queryClient.invalidateQueries(userQuery().queryKey)
      return res
    } else {
      return null
    }
  }

export const homeAction =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const data: AddHabitRequest = {
      name: formData.get('habit-name')?.toString() ?? '',
    }
    const res = await apiFetch<AddHabitRequest, unknown>(
      '/api/habit',
      'POST',
      data
    )
    queryClient.invalidateQueries(habitsQuery().queryKey)
    return res
  }

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  try {
    const data: TokenRequest = {
      email: formData.get('email')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
    }
    const res = await apiFetch<TokenRequest, TokenResponse>(
      '/api/user/token',
      'POST',
      data
    )
    return res.token
  } catch (err: unknown) {
    const message = typeof err === 'string' ? err : 'Unknown error'
    toast.error(message === 'record not found' ? 'Invalid email' : message)
    return null
  }
}

export const usersAction =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const data: AddUserRequest = {
      name: formData.get('name')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
      admin: formData.get('admin')?.toString() === 'true' ?? false,
      timezone: getTimezoneFromString(formData) ?? 'Etc/UTC',
    }
    const res = await apiFetch<AddUserRequest, unknown>(
      '/api/user',
      'POST',
      data
    )
    queryClient.invalidateQueries(usersQuery().queryKey)
    return res
  }
