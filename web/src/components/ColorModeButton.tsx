import { Button, useColorScheme } from '@mui/joy'
import React from 'react'
import { Moon, Sun } from 'react-feather'

function ColorModeButton() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      variant="plain"
      color="neutral"
      size="sm"
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
    >
      {mode === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}

export default ColorModeButton
