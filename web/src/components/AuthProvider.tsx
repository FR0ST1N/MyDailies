import React, { useEffect, useState } from 'react'
import { tokenName } from '../others/consts'
import router from '../router'
import { Payload, UseAuthProviderReturnType } from '../others/types'
import { authContext } from '../others/auth'

interface AuthProviderProps {
  children: React.ReactNode
}

const getPayload = (token: string): Payload | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    return JSON.parse(payload) as Payload
  } catch (error) {
    return null
  }
}

const useAuthProvider = (): UseAuthProviderReturnType => {
  const [user, setUser] = useState<Payload | null>(null)

  const logout = () => {
    localStorage.removeItem(tokenName)
    setUser(null)
    router.navigate('/login')
  }

  const login = (token: string) => {
    localStorage.setItem(tokenName, token)
    setUser(getPayload(token))
    router.navigate('/', { replace: true })
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const auth = getPayload(token)
      setUser(auth)
    } else {
      setUser(null)
    }
  }, [])

  return {
    user,
    login,
    logout,
  }
}

function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthProvider()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export default AuthProvider
