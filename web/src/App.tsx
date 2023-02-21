import React from 'react'
import '@fontsource/public-sans'
import { CssBaseline, CssVarsProvider, extendTheme } from '@mui/joy'
import Habit from './pages/Habit'
import Home from './pages/Home'
import Login from './pages/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Error from './pages/Error'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import StyledToaster from './components/StyledToaster'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'
import { loader as homeLoader, action as homeAction } from './pages/Home'
import LoadingComponent from './components/LoadingComponent'
import { loader as habitLoader } from './pages/Habit'
import Calendar from './components/Calendar'
import { loader as calendarLoader } from './components/Calendar'
import DeleteModal from './components/DeleteModal'
import { action as deleteModalAction } from './components/DeleteModal'
import { action as calendarAction } from './components/Calendar'
import { action as loginAction } from './pages/Login'
import Account from './pages/Account'
import Layout from './pages/Layout'
import {
  loader as accountLoader,
  action as accountAction,
} from './pages/Account'
import { AuthProvider } from './others/auth'
import Users from './pages/Users'
import { loader as usersLoader, action as usersAction } from './pages/Users'

dayjs.extend(relativeTime)
dayjs.extend(isToday)

const queryClient = new QueryClient()

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
        errorElement: <Error />,
        loader: homeLoader(queryClient),
        action: homeAction(queryClient),
      },
      {
        path: 'account',
        element: <Account />,
        errorElement: <Error />,
        loader: accountLoader(queryClient),
        action: accountAction(queryClient),
      },
      {
        path: 'login',
        element: <Login />,
        action: loginAction,
        errorElement: <Error />,
      },
      {
        path: 'users',
        element: <Users />,
        errorElement: <Error />,
        loader: usersLoader(queryClient),
        action: usersAction(queryClient),
      },
      {
        path: 'habit/:habitId',
        element: <Habit />,
        errorElement: <Error />,
        loader: habitLoader(queryClient),
        action: calendarAction(queryClient),
        children: [
          {
            index: true,
            element: <Calendar />,
            loader: calendarLoader(queryClient),
          },
          {
            path: 'delete',
            element: <DeleteModal />,
            action: deleteModalAction(queryClient),
          },
        ],
      },
    ],
  },
])

const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: 'var(--joy-palette-background-surface)',
        },
      },
    },
  },
})

function App() {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <StyledToaster />
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider
            fallbackElement={<LoadingComponent />}
            router={router}
          />
        </QueryClientProvider>
      </AuthProvider>
    </CssVarsProvider>
  )
}

export default App
