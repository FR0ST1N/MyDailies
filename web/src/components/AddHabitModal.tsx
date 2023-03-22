import {
  Button,
  Grid,
  Modal,
  ModalClose,
  ModalDialog,
  Input,
  Typography,
  FormControl,
} from '@mui/joy'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Form, useNavigation } from 'react-router-dom'

interface AddHabitModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}
function AddHabitModal(props: AddHabitModalProps) {
  const { open, setOpen } = props

  const { state } = useNavigation()

  useEffect(() => {
    if (state === 'loading' && open) {
      setOpen(false)
      toast.success('Added new habit')
    }
  })

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <ModalClose />
        <Typography>Add New Habit</Typography>
        <Form method="post">
          <FormControl required>
            <Input sx={{ my: 2 }} placeholder="Habit Name" name="habit-name" />
          </FormControl>
          <Grid container justifyContent="flex-end">
            <Button loading={state === 'submitting'} type="submit">
              Create
            </Button>
          </Grid>
        </Form>
      </ModalDialog>
    </Modal>
  )
}

export default AddHabitModal
