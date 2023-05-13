import { Sheet, Typography } from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { CheckCircle } from 'react-feather'
import { Box } from '@mui/system'

function CheckDecorator() {
  return (
    <Box sx={{ color: 'var(--joy-palette-success-500)' }}>
      <CheckCircle size={15} />
    </Box>
  )
}

interface HabitCardProps {
  name: string
  lastActivity: string | null
  id: number
  completed: boolean
}
function HabitCard(props: HabitCardProps) {
  const { name, lastActivity, id, completed } = props

  const navigate = useNavigate()
  return (
    <Sheet
      variant="soft"
      sx={{
        px: 2,
        py: 2,
        borderRadius: '8px',
        cursor: 'pointer',
      }}
      onClick={() => {
        navigate(`/habit/${id}`)
      }}
    >
      <Typography
        level="h6"
        endDecorator={completed ? <CheckDecorator /> : null}
      >
        {name}
      </Typography>
      <Typography level="body2">
        Last activity {lastActivity ? dayjs(lastActivity).fromNow() : 'none'}
      </Typography>
    </Sheet>
  )
}

export default HabitCard
