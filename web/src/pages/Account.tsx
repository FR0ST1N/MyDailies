import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import * as ct from 'countries-and-timezones'
import { getTimezoneString } from '../others/timezone'
import EditUserModal from '../components/EditUserModal'
import TimezoneSelect from '../components/TimezoneSelect'
import { userQuery } from '../others/query'

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
                : getTimezoneString(ct.getTimezone(user.timezone))}
            </Typography>
          </ListItemContent>
        </ListItem>

        <ListItem>
          <ListItemDecorator>
            <Calendar size={18} />
          </ListItemDecorator>
          <ListItemContent>
            {user?.created_at &&
              `Account created on ${new Date(
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
