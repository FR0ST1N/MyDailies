import { Sheet, Typography, Grid, Divider, Button } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import { getDatesInMonth } from '../others/calendar'
import CalendarDay from './CalendarDay'
import { ArrowLeft, ArrowRight } from 'react-feather'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { useOutletContext, useParams } from 'react-router-dom'
import { invalidHabitId } from '../others/consts'
import { entriesQuery } from '../others/query'

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

interface CalendarOutletProps {
  setDisableCheckIn: (disable: boolean) => void
}

function Calendar() {
  const [date, setDate] = useState(new Date())
  const [completedDays, setCompletedDays] = useState(new Map<number, string>())

  const { setDisableCheckIn } = useOutletContext<CalendarOutletProps>()

  const params = useParams()
  if (params.habitId === undefined) {
    throw invalidHabitId
  }
  const { data: entries } = useQuery(
    entriesQuery({
      id: +params.habitId,
      year: date.getFullYear(),
      month: date.getMonth(),
    })
  )

  useEffect(() => {
    const days = new Map<number, string>()
    if (entries && Array.isArray(entries)) {
      entries.forEach((data) => {
        const currentDate = dayjs(data.date)
        const createdAt = dayjs(data.created_at)
        days.set(currentDate.date(), createdAt.toDate().toLocaleTimeString())
        // Disable the check in button if entry exists for today
        if (currentDate.isToday()) {
          setDisableCheckIn(true)
        }
      })
    }
    setCompletedDays(days)
  }, [entries, setDisableCheckIn])

  return (
    <Sheet variant="outlined" sx={{ borderRadius: '8px', px: 2, py: 2 }}>
      <Grid
        container
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Grid>
          <Button
            variant="plain"
            onClick={() =>
              setDate(new Date(date.getFullYear(), date.getMonth() - 1))
            }
          >
            <ArrowLeft />
          </Button>
        </Grid>
        <Grid>
          <Typography level="body1" fontWeight="bold">
            {`${months[date.getMonth()]} ${date.getFullYear()}`}
          </Typography>
        </Grid>
        <Grid>
          <Button
            variant="plain"
            onClick={() =>
              setDate(new Date(date.getFullYear(), date.getMonth() + 1))
            }
          >
            <ArrowRight />
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        {days.map((day, i) => (
          <Grid
            key={`day-name-${i}`}
            container
            xs={1.5}
            justifyContent="center"
          >
            <Typography level="body2">{day}</Typography>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 1.5 }} />
      {getDatesInMonth(date.getFullYear(), date.getMonth()).map((week, i) => (
        <Grid
          key={`week-${i}`}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ py: 1.5 }}
        >
          {week.map((date, j) =>
            date != null ? (
              <Grid
                key={`week-${i}-day-${j}`}
                container
                xs={1.5}
                justifyContent="center"
              >
                <CalendarDay
                  completed={completedDays.has(date.getDate())}
                  date={date}
                  createdAt={completedDays.get(date.getDate())}
                />
              </Grid>
            ) : (
              <Grid key={`week-${i}-day-${j}`} container xs={1.5} />
            )
          )}
        </Grid>
      ))}
    </Sheet>
  )
}

export default Calendar
