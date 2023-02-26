import { Sheet, Tooltip, Typography, useColorScheme } from '@mui/joy'
import React from 'react'

interface CalendarDayProps {
  day: number
  completed: boolean
  createdAt?: string
}
function CalendarDay(props: CalendarDayProps) {
  const { day, completed, createdAt } = props
  const { mode } = useColorScheme()
  return (
    <Tooltip title={createdAt}>
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
          cursor: completed ? 'pointer' : 'default',
        }}
      >
        <Typography
          textColor={mode === 'light' && completed ? 'white' : ''}
          level="body1"
          sx={{ cursor: 'inherit' }}
        >
          {day}
        </Typography>
      </Sheet>
    </Tooltip>
  )
}

export default CalendarDay
