import { List, ListItem, ListItemDecorator, Stack, Typography } from '@mui/joy'
import { Container } from '@mui/system'
import { QueryClient, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { User } from 'react-feather'
import { ActionFunctionArgs } from 'react-router-dom'
import { UserResponse } from '../pages/Account'
import AddUserModal from '../components/AddUserModal'
import AdminChip from '../components/AdminChip'
import TitleWithAddIcon from '../components/TitleWithAddIcon'
import { apiFetch } from '../others/api'
import { getTimezoneFromString } from '../others/timezone'

interface AddUserRequest {
  name: string
  email: string
  password: string
  admin: boolean
  timezone: string
}

export const usersQuery = () => ({
  queryKey: ['users'],
  queryFn: async () =>
    apiFetch<null, UserResponse[]>('/api/user/all', 'GET', null),
})

export const loader = (queryClient: QueryClient) => async () => {
  const query = usersQuery()
  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const data: AddUserRequest = {
      name: formData.get('name')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      password: formData.get('password')?.toString() ?? '',
      admin: formData.get('admin')?.toString() === 'true' ?? false,
      timezone: getTimezoneFromString(formData) ?? 'Etc/UTC',
    }
    const res = await apiFetch<AddUserRequest, any>('/api/user', 'POST', data)
    queryClient.invalidateQueries(usersQuery().queryKey)
    return res
  }

function Users() {
  const [showAddUserModal, setShowAddUserModal] = useState(false)

  const { data: users } = useQuery(usersQuery())
  return (
    <Container sx={{ marginBottom: 1 }}>
      <TitleWithAddIcon
        title="Users"
        action={() => setShowAddUserModal(true)}
      />
      <List>
        {users?.map((user) => (
          <ListItem key={`user-${user.email}`}>
            <ListItemDecorator>
              <User />
            </ListItemDecorator>
            <Stack direction="column">
              <Typography
                level="body1"
                component={'span'}
                endDecorator={<AdminChip admin={user.admin} />}
              >
                {user.name}
              </Typography>
              <Typography level="body2">{user.email}</Typography>
            </Stack>
          </ListItem>
        ))}
      </List>
      <AddUserModal open={showAddUserModal} setOpen={setShowAddUserModal} />
    </Container>
  )
}

export default Users
