import React from 'react'
import CircularProgress from '@mui/joy/CircularProgress'

function LoadingComponent() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '85vh',
      }}
    >
      <CircularProgress variant="plain" />
    </div>
  )
}

export default LoadingComponent
