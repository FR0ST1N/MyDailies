import React from 'react'
import useAuth from '../others/useAuth'

interface AuthComponentProps {
  children: React.ReactNode
}
function AuthComponent({ children }: AuthComponentProps) {
  const { user } = useAuth()
  return <>{user && children}</>
}

export default AuthComponent
