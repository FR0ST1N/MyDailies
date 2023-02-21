import React, { useState } from 'react'
import { apiFetch } from '../others/api'
import { QueryClient, useQuery } from '@tanstack/react-query'
import AdminChip from '../components/AdminChip'
import { Container } from '@mui/system'
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from '@mui/joy'
import { Calendar, Mail, User, Clock, Edit } from 'react-feather'
import ChangePasswordModal from '../components/ChangePasswordModal'
import { ActionFunctionArgs } from 'react-router-dom'
import * as ct from 'countries-and-timezones'
import { getTimezoneFromString, getTimezoneString } from '../others/timezone'
import EditUserModal from '../components/EditUserModal'
import TimezoneSelect from '../components/TimezoneSelect'

export interface UserResponse {
  name: string
  email: string
  created_at: string
  admin: boolean
  timezone: string
}

interface ChangePasswordRequest {
  password: string
  new_password: string
}

type ActionIntent = 'info' | 'password' | null

interface PatchUserRequest {
  timezone?: string
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

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const intent = formData.get('intent')?.toString() as ActionIntent
    if (intent === 'password') {
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
    } else if (intent === 'info') {
      const timezone = getTimezoneFromString(formData) ?? undefined
      const data: PatchUserRequest = {
        timezone: timezone,
      }
      const res = await apiFetch<PatchUserRequest, any>(
        '/api/user',
        'PATCH',
        data
      )
      queryClient.invalidateQueries(userQuery().queryKey)
      return res
    } else {
      return null
    }
  }

function Account() {
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false)
  const [openChangeTimezone, setOpenChangeTimezone] = useState(false)

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
            <Clock size={18} />
          </ListItemDecorator>
          <ListItemContent>
            <Typography
              endDecorator={
                <IconButton
                  size="sm"
                  variant="plain"
                  onClick={() => setOpenChangeTimezone(true)}
                >
                  <Edit size={18} />
                </IconButton>
              }
            >
              {user?.timezone === undefined
                ? 'Empty'
                : getTimezoneString(ct.getTimezone(user.timezone)!)}
            </Typography>
          </ListItemContent>
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
      <EditUserModal
        open={openChangeTimezone}
        setOpen={setOpenChangeTimezone}
        children={<TimezoneSelect />}
      />
    </Container>
  )
}

export default Account
