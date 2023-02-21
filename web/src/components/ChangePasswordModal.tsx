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
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Form, useNavigation } from 'react-router-dom'
import PasswordInputDecorator from './PasswordInputDecorator'

interface ChangePasswordModalProps {
  open: boolean
  setOpen: Function
}
function ChangePasswordModal(props: ChangePasswordModalProps) {
  const { open, setOpen } = props
  const [newPassword, setNewPassword] = useState('')
  const [reenterNewPassword, setReenterNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { state } = useNavigation()

  useEffect(() => {
    if (state === 'loading' && open) {
      setOpen(false)
      toast.success('Changed password')
    }
  })

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <ModalClose />
        <Typography>Change Password</Typography>
        <Form method="patch">
          <FormControl required>
            <Input
              sx={{ my: 2 }}
              placeholder="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              endDecorator={
                <PasswordInputDecorator
                  show={showPassword}
                  setShow={setShowPassword}
                  size="sm"
                />
              }
            />
          </FormControl>
          <FormControl required>
            <Input
              sx={{ my: 2 }}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              name="new-password"
              type="password"
            />
          </FormControl>
          <FormControl required>
            <Input
              sx={{ my: 2 }}
              onChange={(e) => setReenterNewPassword(e.target.value)}
              placeholder="Reenter New Password"
              name="new-password-reenter"
              type="password"
            />
          </FormControl>
          <Grid container justifyContent="flex-end">
            <Button
              disabled={
                newPassword.length < 6 || newPassword !== reenterNewPassword
              }
              loading={state === 'submitting'}
              type="submit"
              name="intent"
              value="password"
            >
              Change
            </Button>
          </Grid>
        </Form>
      </ModalDialog>
    </Modal>
  )
}

export default ChangePasswordModal
