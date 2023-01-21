import {
  Button,
  Grid,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from '@mui/joy'
import { QueryClient } from '@tanstack/react-query'
import React from 'react'
import toast from 'react-hot-toast'
import {
  ActionFunctionArgs,
  Form,
  redirect,
  useNavigate,
  useNavigation,
} from 'react-router-dom'
import { apiFetch } from '../others/api'
import { habitQuery } from '../pages/Habit'
import { habitsQuery } from '../pages/Home'

export const action =
  (queryClient: QueryClient) =>
  async ({ params }: ActionFunctionArgs) => {
    const id = params.habitId as string
    await apiFetch<null, any>(`/api/habit/${id}`, 'DELETE', null)
    // Remove
    queryClient.removeQueries(habitQuery(id).queryKey)
    queryClient.removeQueries(['entries', +id])
    // Invalidate
    queryClient.invalidateQueries(habitsQuery().queryKey)

    toast('Deleted habit', { icon: '🗑️' })
    // Return home
    return redirect('/')
  }

function DeleteModal() {
  const { state } = useNavigation()
  const navigate = useNavigate()

  return (
    <Modal
      open={true}
      onClose={() => {
        if (state !== 'submitting') {
          navigate(-1)
        }
      }}
    >
      <ModalDialog color="danger">
        <ModalClose disabled={state === 'submitting'} />
        <Typography color="danger">Delete Habit</Typography>
        <Typography level="body2" sx={{ mt: 1 }}>
          Are you sure you want to delete this habit?
        </Typography>
        <Grid container justifyContent="flex-end" sx={{ mt: 0.5 }}>
          <Form method="delete">
            <Button
              variant="plain"
              loading={state === 'submitting'}
              type="submit"
            >
              Yes
            </Button>
            <Button
              variant="plain"
              disabled={state === 'submitting'}
              onClick={() => navigate(-1)}
            >
              No
            </Button>
          </Form>
        </Grid>
      </ModalDialog>
    </Modal>
  )
}

export default DeleteModal
