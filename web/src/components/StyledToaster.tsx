import React from 'react'
import { Toaster } from 'react-hot-toast'

function StyledToaster() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: 'var(--joy-palette-common-white)',
          color: 'var(--joy-palette-common-black)',
        },
        success: {
          iconTheme: {
            primary: 'var(--joy-palette-success-500)',
            secondary: 'var(--joy-palette-common-white)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--joy-palette-danger-500)',
            secondary: 'var(--joy-palette-common-white)',
          },
        },
      }}
    />
  )
}

export default StyledToaster
