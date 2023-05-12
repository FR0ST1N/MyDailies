import { createContext } from 'react'
import { UseAuthProviderReturnType } from './types'

export const authContext = createContext<UseAuthProviderReturnType>(
  {} as UseAuthProviderReturnType
)
