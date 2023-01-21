import { Typography, Container, Grid, IconButton, Tooltip } from '@mui/joy'
import React, { useState } from 'react'
import { CheckCircle, Trash2 } from 'react-feather'
import { apiFetch } from '../others/api'
import {
  LoaderFunctionArgs,
  Outlet,
  useNavigate,
  useNavigation,
  useParams,
  useSubmit,
} from 'react-router-dom'
import dayjs from 'dayjs'
import { QueryClient, useQuery } from '@tanstack/react-query'

interface HabitResponse {
  name: string
  created_at: string
  id: number
}

export const habitQuery = (id: string) => ({
  queryKey: ['habit', id],
  queryFn: async () =>
    apiFetch<null, HabitResponse>(`/api/habit/${id}`, 'GET', null),
})

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const query = habitQuery(params.habitId as string)
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  }

function Habit() {
  const params = useParams()
  const id = params.habitId as string

  const [disableCheckIn, setDisableCheckIn] = useState<boolean>(false)

  const navigate = useNavigate()
  const { state } = useNavigation()
  const submit = useSubmit()

  const { data: habit } = useQuery(habitQuery(id))

  return (
    <Container sx={{ marginBottom: 1 }}>
      <Typography level="h3" sx={{ marginTop: 1.5 }} fontWeight="lg">
        {habit?.name}
      </Typography>
      <Typography level="body3">{`Created at ${dayjs(habit?.created_at)
        .toDate()
        .toLocaleDateString()}`}</Typography>
      <Typography level="body2" fontWeight="lg" sx={{ my: 1.5 }}>
        Actions
      </Typography>
      <Grid container spacing={1}>
        <Grid>
          <Tooltip title="Check-in">
            <IconButton
              color="success"
              variant="plain"
              disabled={state === 'submitting' || disableCheckIn}
              onClick={() => submit(null, { method: 'post' })}
            >
              <CheckCircle size={18} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid>
          <Tooltip title="Delete">
            <IconButton
              color="danger"
              variant="plain"
              onClick={() => navigate(`/habit/${id}/delete`)}
            >
              <Trash2 size={18} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Typography level="body2" fontWeight="lg" sx={{ my: 1.5 }}>
        Calendar
      </Typography>
      <Outlet context={{ setDisableCheckIn }} />
    </Container>
  )
}

export default Habit
