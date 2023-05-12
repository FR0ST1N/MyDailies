import { useContext } from 'react'
import { authContext } from './auth'

const useAuth = () => {
  return useContext(authContext)
}

export default useAuth
