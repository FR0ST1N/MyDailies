import { Sheet, Typography, useColorScheme } from '@mui/joy'
import React from 'react'

interface CalendarDayProps {
  day: number
  completed: boolean
}
function CalendarDay(props: CalendarDayProps) {
  const { day, completed } = props
  const { mode } = useColorScheme()
  return (
    <Sheet
      variant={completed ? 'solid' : 'soft'}
      color={completed ? 'success' : 'neutral'}
      sx={{
        borderRadius: '50%',
        width: '2em',
        height: '2em',
        py: 0.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        textColor={mode === 'light' && completed ? 'white' : ''}
        level="body1"
        sx={{ cursor: 'default' }}
      >
        {day}
      </Typography>
    </Sheet>
  )
}

export default CalendarDay
