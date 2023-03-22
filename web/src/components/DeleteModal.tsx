import {
  Button,
  Grid,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from '@mui/joy'
import React from 'react'
import { Form, useNavigate, useNavigation } from 'react-router-dom'

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
