import { QueryClient } from '@tanstack/react-query'
import { LoaderFunctionArgs } from 'react-router-dom'
import {
  entriesQuery,
  userQuery,
  habitQuery,
  habitsQuery,
  usersQuery,
} from '../others/query'
import { getEntryRequestObject } from '../others/helper'

export const calendarLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const id = params.habitId
    const query = entriesQuery(getEntryRequestObject(id))
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  }

export const accountLoader = (queryClient: QueryClient) => async () => {
  const query = userQuery()
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}

export const habitLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const query = habitQuery(params.habitId as string)
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  }

export const homeLoader = (queryClient: QueryClient) => async () => {
  const query = habitsQuery()
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}

export const usersLoader = (queryClient: QueryClient) => async () => {
  const query = usersQuery()
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
