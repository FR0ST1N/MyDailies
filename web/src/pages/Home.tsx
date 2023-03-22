import { Container, Stack, Typography } from '@mui/joy'
import React, { useState } from 'react'
import AddHabitModal from '../components/AddHabitModal'
import HabitCard from '../components/HabitCard'
import { useQuery } from '@tanstack/react-query'
import TitleWithAddIcon from '../components/TitleWithAddIcon'
import { Frown } from 'react-feather'
import { habitsQuery } from '../others/query'

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
