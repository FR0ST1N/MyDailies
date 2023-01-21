import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Modal,
  ModalClose,
  ModalDialog,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/joy'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Form, useNavigation } from 'react-router-dom'
import PasswordInputDecorator from './PasswordInputDecorator'

interface AddUserModalProps {
  open: boolean
  setOpen: Function
}
function AddUserModal(props: AddUserModalProps) {
  const { open, setOpen } = props
  const [showPassword, setShowPassword] = useState(false)

  const { state } = useNavigation()

  useEffect(() => {
    if (state === 'loading' && open) {
      setOpen(false)
      toast.success('Added new user')
    }
  })

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <ModalClose />
        <Typography>Add New User</Typography>
        <Form method="post">
          <TextField sx={{ my: 2 }} required placeholder="Name" name="name" />
          <TextField
            required
            sx={{ my: 2 }}
            type="email"
            placeholder="Email"
            name="email"
          />
          <TextField
            required
            sx={{ my: 2 }}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            endDecorator={
              <PasswordInputDecorator
                show={showPassword}
                setShow={setShowPassword}
                size="sm"
              />
            }
            name="password"
          />
          <FormControl required>
            <FormLabel>Admin</FormLabel>
            <RadioGroup row defaultValue="false" name="admin" sx={{ my: 1 }}>
              <Radio label="No" value="false" />
              <Radio label="Yes" value="true" />
            </RadioGroup>
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

export default AddUserModal
