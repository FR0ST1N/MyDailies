import {
  Button,
  Grid,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from '@mui/joy'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Form, useNavigation } from 'react-router-dom'

interface EditUserModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
}
function EditUserModal(props: EditUserModalProps) {
  const { open, setOpen } = props

  const { state } = useNavigation()

  useEffect(() => {
    if (state === 'loading' && open) {
      setOpen(false)
      toast.success('Updated')
    }
  })

  return (
    <Modal sx={{ zIndex: 1000 }} open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <ModalClose />
        <Typography>Edit</Typography>
        <Form method="patch">
          <Box sx={{ my: 2 }}>{props.children}</Box>
          <Grid container justifyContent="flex-end">
            <Button
              loading={state === 'submitting'}
              type="submit"
              name="intent"
              value="info"
            >
              Update
            </Button>
          </Grid>
        </Form>
      </ModalDialog>
    </Modal>
  )
}

export default EditUserModal
