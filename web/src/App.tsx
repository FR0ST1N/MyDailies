import React from 'react'
import '@fontsource/public-sans'
import { CssBaseline, CssVarsProvider, extendTheme } from '@mui/joy'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import StyledToaster from './components/StyledToaster'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'
import LoadingComponent from './components/LoadingComponent'
import AuthProvider from './components/AuthProvider'
import router from './router'
import { queryClient } from './others/query'

dayjs.extend(relativeTime)
dayjs.extend(isToday)

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
