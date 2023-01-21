import { Button, Sheet, TextField, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import { LogIn } from 'react-feather'
import toast from 'react-hot-toast'
import {
  ActionFunctionArgs,
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from 'react-router-dom'
import PasswordInputDecorator from '../components/PasswordInputDecorator'
import { apiFetch } from '../others/api'
import { useAuth } from '../others/auth'

interface TokenRequest {
  email: string
  password: string
}

interface TokenResponse {
  token: string
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  try {
    const data: TokenRequest = {
      email: formData.get('email')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
    }
    const res = await apiFetch<TokenRequest, TokenResponse>(
      '/api/user/token',
      'POST',
      data
    )
    return res.token
  } catch (err: any) {
    toast.error(err === 'record not found' ? 'Invalid email' : err)
    return null
  }
}

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
          <TextField
            required
            name="email"
            type="email"
            placeholder="user@example.com"
            label="Email"
            size="lg"
          />
          <TextField
            required
            name="password"
            placeholder="password"
            label="Password"
            size="lg"
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
