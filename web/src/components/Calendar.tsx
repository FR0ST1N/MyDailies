import { Sheet, Typography, Grid, Divider, Button } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import { getDatesInMonth } from '../others/calendar'
import CalendarDay from './CalendarDay'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { apiFetch } from '../others/api'
import dayjs from 'dayjs'
import { QueryClient, useQuery } from '@tanstack/react-query'
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useOutletContext,
  useParams,
} from 'react-router-dom'
import toast from 'react-hot-toast'
import { habitQuery } from '../pages/Habit'

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

interface EntryResponse {
  id: number
  date: string
  created_at: string
}

interface EntryQueryParams {
  id: number
  year: number
  month: number
}

const invalidIdErr = new Error('Invalid habit id')

export const getEntryRequestObject = (
  id: string | undefined
): EntryQueryParams => {
  if (id === undefined) {
    throw invalidIdErr
  }
  const idNum = +id
  const date = new Date()
  return {
    id: idNum,
    year: date.getFullYear(),
    month: date.getMonth(),
  }
}

export const entriesQuery = (entry: EntryQueryParams) => ({
  queryKey: ['entries', entry.id, { year: entry.year, month: entry.month }],
  queryFn: async () =>
    apiFetch<null, EntryResponse[]>(
      `/api/habit/${entry.id}/entry?year=${entry.year}&month=${
        entry.month + 1
      }`,
      'GET',
      null
    ),
})

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    var id = params.habitId
    const query = entriesQuery(getEntryRequestObject(id))
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  }

export const action =
  (queryClient: QueryClient) =>
  async ({ params }: ActionFunctionArgs) => {
    const id = params.habitId
    if (id === undefined) {
      throw invalidIdErr
    }
    const res = await apiFetch<null, any>(
      `/api/habit/${id}/entry`,
      'POST',
      null
    )
    queryClient.invalidateQueries(
      entriesQuery(getEntryRequestObject(id)).queryKey
    )
    queryClient.invalidateQueries(habitQuery(id).queryKey)
    toast('Checked-in for today', { icon: '🎉' })
    return res
  }

interface CalendarOutletProps {
  setDisableCheckIn: Function
}

function Calendar() {
  const [date, setDate] = useState(new Date())
  const [completedDays, setCompletedDays] = useState(new Map<number, string>())

  const { setDisableCheckIn } = useOutletContext<CalendarOutletProps>()

  const params = useParams()
  if (params.habitId === undefined) {
    throw invalidIdErr
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
          {week.map((day, j) =>
            day != null ? (
              <Grid
                key={`week-${i}-day-${j}`}
                container
                xs={1.5}
                justifyContent="center"
              >
                <CalendarDay
                  completed={completedDays.has(day)}
                  day={day}
                  createdAt={completedDays.get(day)}
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
