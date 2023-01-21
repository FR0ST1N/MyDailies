import React, { useState } from 'react'
import { apiFetch } from '../others/api'
import { QueryClient, useQuery } from '@tanstack/react-query'
import AdminChip from '../components/AdminChip'
import { Container } from '@mui/system'
import {
  Button,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from '@mui/joy'
import { Calendar, Mail, User } from 'react-feather'
import ChangePasswordModal from '../components/ChangePasswordModal'
import { ActionFunctionArgs } from 'react-router-dom'

export interface UserResponse {
  name: string
  email: string
  created_at: string
  admin: boolean
}

interface ChangePasswordRequest {
  password: string
  new_password: string
}

export const userQuery = () => ({
  queryKey: ['user'],
  queryFn: async () => apiFetch<null, UserResponse>(`/api/user`, 'GET', null),
})

export const loader = (queryClient: QueryClient) => async () => {
  const query = userQuery()
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const data: ChangePasswordRequest = {
    password: formData.get('password')?.toString() ?? '',
    new_password: formData.get('new-password')?.toString() ?? '',
  }
  const res = await apiFetch<ChangePasswordRequest, any>(
    '/api/user/password',
    'PATCH',
    data
  )
  return res
}

function Account() {
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false)

  const { data: user } = useQuery(userQuery())

  return (
    <Container sx={{ marginBottom: 1 }}>
      <Typography
        level="h3"
        sx={{ marginTop: 1.5 }}
        fontWeight="lg"
        endDecorator={<AdminChip admin={user?.admin} />}
      >
        My Account
      </Typography>
      <List>
        <ListItem>
          <ListItemDecorator>
            <User size={18} />
          </ListItemDecorator>
          <ListItemContent>{user?.name}</ListItemContent>
        </ListItem>

        <ListItem>
          <ListItemDecorator>
            <Mail size={18} />
          </ListItemDecorator>
          <ListItemContent>{user?.email}</ListItemContent>
        </ListItem>

        <ListItem>
          <ListItemDecorator>
            <Calendar size={18} />
          </ListItemDecorator>
          <ListItemContent>
            {user?.created_at &&
              `Account created at ${new Date(
                user?.created_at
              ).toLocaleDateString()}`}
          </ListItemContent>
        </ListItem>
      </List>
      <Button
        variant="plain"
        sx={{ mt: 0.5 }}
        onClick={() => setOpenChangePasswordModal(true)}
      >
        Change Password
      </Button>
      <ChangePasswordModal
        open={openChangePasswordModal}
        setOpen={setOpenChangePasswordModal}
      />
    </Container>
  )
}

export default Account
