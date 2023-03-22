import { Typography, Container, Grid, IconButton, Tooltip } from '@mui/joy'
import React, { useState } from 'react'
import { CheckCircle, Trash2 } from 'react-feather'
import {
  Outlet,
  useNavigate,
  useNavigation,
  useParams,
  useSubmit,
} from 'react-router-dom'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { Stack } from '@mui/system'
import StatCard from '../components/StatCard'
import { habitQuery } from '../others/query'

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
        Stats
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          paddingBottom: 2,
        }}
      >
        <StatCard title="Streak" stat={habit?.streak} />
        <StatCard title="Longest Streak" stat={habit?.longest_streak} />
        <StatCard title="Completed Days" stat={habit?.entries_count} />
      </Stack>
      <Typography level="body2" fontWeight="lg" sx={{ my: 1.5 }}>
        Calendar
      </Typography>
      <Outlet context={{ setDisableCheckIn }} />
    </Container>
  )
}

export default Habit
