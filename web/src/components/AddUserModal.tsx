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
  Input,
  Typography,
} from '@mui/joy'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Form, useNavigation } from 'react-router-dom'
import PasswordInputDecorator from './PasswordInputDecorator'
import TimezoneSelect from './TimezoneSelect'

interface AddUserModalProps {
  open: boolean
  setOpen: (open: boolean) => void
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
    <Modal sx={{ zIndex: 1000 }} open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <ModalClose />
        <Typography>Add New User</Typography>
        <Form method="post">
          <FormControl required>
            <Input sx={{ my: 2 }} placeholder="Name" name="name" />
          </FormControl>
          <FormControl required>
            <Input
              sx={{ my: 2 }}
              type="email"
              placeholder="Email"
              name="email"
            />
          </FormControl>
          <FormControl required>
            <Input
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
          </FormControl>
          <FormControl required sx={{ my: 2 }}>
            <TimezoneSelect />
          </FormControl>
          <FormControl required>
            <FormLabel>Admin</FormLabel>
            <RadioGroup
              orientation="horizontal"
              defaultValue="false"
              name="admin"
              sx={{ my: 1 }}
            >
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
