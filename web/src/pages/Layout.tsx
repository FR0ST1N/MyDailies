import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import useAuth from '../others/useAuth'

function Layout() {
  const location = useLocation()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname !== '/login' && user === null) {
      navigate('/login')
    }
  }, [location, navigate, user])

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default Layout
