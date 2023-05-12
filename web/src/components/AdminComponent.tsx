import React from 'react'
import useAuth from '../others/useAuth'

interface AdminComponentProps {
  children: React.ReactNode
}
function AdminComponent({ children }: AdminComponentProps) {
  const { user } = useAuth()
  return <>{user && user.admin && children}</>
}

export default AdminComponent
