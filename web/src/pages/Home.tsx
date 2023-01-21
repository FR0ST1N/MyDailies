import { Container, Stack, Typography } from '@mui/joy'
import React, { useState } from 'react'
import AddHabitModal from '../components/AddHabitModal'
import HabitCard from '../components/HabitCard'
import { apiFetch } from '../others/api'
import { QueryClient, useQuery } from '@tanstack/react-query'
import { ActionFunctionArgs } from 'react-router-dom'
import TitleWithAddIcon from '../components/TitleWithAddIcon'
import { Frown } from 'react-feather'

interface HomeCardResponse {
  id: number
  name: string
  created_at: string
  last_activity: string
}

interface AddHabitRequest {
  name: string
}

export const habitsQuery = () => ({
  queryKey: ['habits'],
  queryFn: async () =>
    apiFetch<null, HomeCardResponse[]>('/api/habit/all', 'GET', null),
})

export const loader = (queryClient: QueryClient) => async () => {
  const query = habitsQuery()
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const data: AddHabitRequest = {
      name: formData.get('habit-name')?.toString() ?? '',
    }
    const res = await apiFetch<AddHabitRequest, any>('/api/habit', 'POST', data)
    queryClient.invalidateQueries(habitsQuery().queryKey)
    return res
  }

function Home() {
  const [openAddModal, setOpenAddModal] = useState(false)

  const { data: habits } = useQuery(habitsQuery())
  return (
    <Container sx={{ marginBottom: 1 }}>
      <TitleWithAddIcon title="Habits" action={() => setOpenAddModal(true)} />
      <Stack spacing={2}>
        {habits &&
          habits.map((habit, index) => (
            <HabitCard
              key={`habit-${index}`}
              name={habit.name}
              id={habit.id}
              lastActivity={habit.last_activity}
            />
          ))}
        {habits && habits.length === 0 && (
          <Stack direction="row" justifyContent="center">
            <Typography level="h6" endDecorator={<Frown size={18} />}>
              No Habits
            </Typography>
          </Stack>
        )}
      </Stack>
      <AddHabitModal open={openAddModal} setOpen={setOpenAddModal} />
    </Container>
  )
}

export default Home
