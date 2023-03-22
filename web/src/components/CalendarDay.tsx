import {
  ColorPaletteProp,
  Sheet,
  Tooltip,
  Typography,
  useColorScheme,
} from '@mui/joy'
import dayjs from 'dayjs'
import React from 'react'

interface CalendarDayProps {
  date: Date
  completed: boolean
  createdAt?: string
}
function CalendarDay(props: CalendarDayProps) {
  const { date, completed, createdAt } = props
  const { mode } = useColorScheme()
  const isToday = dayjs(date).isToday()

  // Sheet color stuff
  let sheetColor: ColorPaletteProp = 'neutral'
  if (completed) {
    sheetColor = 'success'
  } else if (isToday) {
    sheetColor = 'primary'
  }
  const isSolidSheet = completed || sheetColor !== 'neutral'

  return (
    <Tooltip title={createdAt}>
      <Sheet
        variant={isSolidSheet ? 'solid' : 'soft'}
        color={sheetColor}
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
          textColor={mode === 'light' && isSolidSheet ? 'white' : ''}
          level="body1"
          sx={{ cursor: 'inherit', userSelect: 'none' }}
        >
          {date.getDate()}
        </Typography>
      </Sheet>
    </Tooltip>
  )
}

export default CalendarDay
