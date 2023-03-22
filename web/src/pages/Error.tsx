import { Typography } from '@mui/joy'
import React, { useEffect } from 'react'
import { useRouteError } from 'react-router-dom'
import useAuth from '../others/useAuth'

function Error() {
  const error = useRouteError()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (
      user === null ||
      (typeof error === 'string' &&
        (error.startsWith('token is expired') ||
          error === 'token contains an invalid number of segments'))
    ) {
      logout()
    }
  }, [user, logout, error])

  return (
    <>
      <Typography level="h1" sx={{ m: 2 }}>
        Something went wrong.
      </Typography>
      {typeof error === 'string' && (
        <Typography level="body1" sx={{ m: 2 }}>
          {error}
        </Typography>
      )}
    </>
  )
}

export default Error
