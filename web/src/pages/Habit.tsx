import {
  Typography,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Textarea,
  Box,
  Button,
} from '@mui/joy'
import React, { useState, useEffect } from 'react'
import { CheckCircle, Trash2, Edit2 } from 'react-feather'
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
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { Stack } from '@mui/system'
import StatCard from '../components/StatCard'

interface HabitResponse {
  name: string
  created_at: string
  id: number
  entries_count: number
  streak: number
  longest_streak: number
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
  const [isNoteActive, setIsNoteActive] = useState<boolean>(false)

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
        <Grid>
          <Tooltip title="Add/Edit Note">
            <IconButton
              color="primary"
              variant="plain"
              disabled={!disableCheckIn || isNoteActive}
              onClick={() => setIsNoteActive(true)}
            >
              <Edit2 size={18} />
            </IconButton>
          </Tooltip>
        </Grid>

        {/* notes */}
        <Grid>
          <Note
            enable={isNoteActive}
            habbitId={parseInt(id)}
            //todo get entryId dynamically
            entryId={3}
            setNoteStatus={(noteState) => setIsNoteActive(noteState)}
          />
        </Grid>
        {/* notesend */}
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

interface NoteRequest {
  note: string
}

interface NotePayload {
  habbitId: string
  entryId: string
  note: string
}

export const updateNote = async (data: NotePayload) => {
  return apiFetch<NoteRequest, null>(
    `/api/habit/${data.habbitId}/entry/${data.entryId}/note/`,
    'POST',
    { note: data.note }
  )
}

interface NoteProps {
  enable: Boolean
  habbitId: number
  entryId: number
  setNoteStatus: (state: boolean) => void
}

const Note = ({ enable, setNoteStatus, habbitId, entryId }: NoteProps) => {
  const [notetext, setNoteText] = useState('')
  const [savedText, setSavedText] = useState<string | null>(null)

  const { mutate, isLoading, isError } = useMutation<NotePayload>(
    updateNote as unknown as any,
    {
      onSuccess: () => {
        setSavedText(notetext)
      },
    }
  )

  const resetValues = () => {
    setNoteText('')
    setSavedText(null)
  }

  useEffect(() => {
    return () => {
      resetValues()
    }
  }, [])

  if (!enable) {
    return <></>
  }

  return (
    <>
      <Textarea
        size="lg"
        name="Size"
        placeholder="Type something"
        minRows={4}
        maxRows={4}
        value={notetext}
        disabled={isLoading}
        onChange={(e) => {
          if (e) {
            const v = e.currentTarget.value
            setNoteText(v)
          }
        }}
        endDecorator={
          <Box
            sx={{
              display: 'flex',
              gap: 'var(--Textarea-paddingBlock)',
              pt: 'var(--Textarea-paddingBlock)',
              borderTop: '1px solid',
              borderColor: 'divider',
              flex: 'auto',
            }}
          >
            <Button
              size="sm"
              disabled={isLoading}
              variant="plain"
              sx={{ ml: 'auto' }}
              onClick={() => {
                setNoteStatus(false)
                resetValues()
              }}
            >
              Cancel
            </Button>
            <Button
              sx={{ ml: 'auto' }}
              loading={isLoading}
              disabled={savedText === notetext}
              size="sm"
              onClick={() =>
                mutate({
                  habbitId: habbitId,
                  entryId: entryId,
                  note: notetext.trim(),
                } as unknown as any)
              }
            >
              Save
            </Button>
          </Box>
        }
      />
    </>
  )
}

export default Habit
