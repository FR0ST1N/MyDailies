import {
  Button,
  Sheet,
  Input,
  Typography,
  FormControl,
  FormLabel,
} from '@mui/joy'
import React, { useEffect, useState } from 'react'
import { LogIn } from 'react-feather'
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from 'react-router-dom'
import PasswordInputDecorator from '../components/PasswordInputDecorator'
import useAuth from '../others/useAuth'

function Login() {
  const { state } = useNavigation()
  const token: string = useActionData() as string
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (token) {
      login(token)
    }
  }, [token, login])

  useEffect(() => {
    if (user !== null) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <Sheet
      sx={{
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        minHeight: '85vh',
      }}
      variant="plain"
    >
      <Sheet
        sx={{
          width: 350,
          mx: 'auto',
          my: 'auto',
          py: 3,
          px: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        variant="plain"
      >
        <div>
          <Typography level="h4" component="h1">
            <b>Sign in</b>
          </Typography>
          <Typography level="body2">to continue to MyDailies.</Typography>
        </div>
        <Form method="post">
          <FormControl required size="lg">
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" placeholder="user@example.com" />
          </FormControl>
          <FormControl required size="lg">
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              placeholder="password"
              type={showPassword ? 'text' : 'password'}
              endDecorator={
                <PasswordInputDecorator
                  show={showPassword}
                  setShow={setShowPassword}
                  size="md"
                />
              }
              sx={{ mt: 1 }}
            />
          </FormControl>
          <Button
            startDecorator={<LogIn size={18} />}
            loading={state === 'submitting'}
            type="submit"
            sx={{ mt: 1 }}
          >
            Log in
          </Button>
        </Form>
        <Typography fontSize="sm" sx={{ alignSelf: 'center' }}>
          Contact admin to create new account.
        </Typography>
      </Sheet>
    </Sheet>
  )
}

export default Login
