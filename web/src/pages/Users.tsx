import { List, ListItem, ListItemDecorator, Stack, Typography } from '@mui/joy'
import { Container } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { User } from 'react-feather'
import AddUserModal from '../components/AddUserModal'
import AdminChip from '../components/AdminChip'
import TitleWithAddIcon from '../components/TitleWithAddIcon'
import { usersQuery } from '../others/query'

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
