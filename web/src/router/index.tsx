import React from 'react'
import Habit from '../pages/Habit'
import Home from '../pages/Home'
import Login from '../pages/Login'
import { createBrowserRouter } from 'react-router-dom'
import Error from '../pages/Error'
import Calendar from '../components/Calendar'
import {
  calendarLoader,
  accountLoader,
  homeLoader,
  habitLoader,
  usersLoader,
} from '../router/loaders'
import {
  deleteModalAction,
  calendarAction,
  accountAction,
  homeAction,
  loginAction,
  usersAction,
} from '../router/actions'
import DeleteModal from '../components/DeleteModal'
import Account from '../pages/Account'
import Layout from '../pages/Layout'
import Users from '../pages/Users'
import { queryClient } from '../others/query'

const router = createBrowserRouter([
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

export default router
