import { Button, MenuItem, Menu, ListItemDecorator } from '@mui/joy'
import React from 'react'
import { GitHub, LogOut, MoreVertical, User, Users } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import useAuth from '../others/useAuth'
import AdminComponent from './AdminComponent'
import AuthComponent from './AuthComponent'

function MoreButton() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const { logout } = useAuth()
  const open = Boolean(anchorEl)

  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        variant="plain"
        color="neutral"
        size="sm"
        id="more-button"
        aria-controls={open ? 'more-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertical />
      </Button>
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        aria-labelledby="more-button"
      >
        <AdminComponent>
          <MenuItem onClick={() => navigate('/users')}>
            <ListItemDecorator>
              <Users />
            </ListItemDecorator>{' '}
            Users
          </MenuItem>
        </AdminComponent>
        <AuthComponent>
          <MenuItem onClick={() => navigate(`/account`)}>
            <ListItemDecorator>
              <User />
            </ListItemDecorator>{' '}
            My Account
          </MenuItem>
          <MenuItem onClick={() => logout()}>
            <ListItemDecorator>
              <LogOut />
            </ListItemDecorator>{' '}
            Logout
          </MenuItem>
        </AuthComponent>
        <MenuItem
          onClick={() =>
            window.open(
              'https://github.com/FR0ST1N/MyDailies',
              '_blank',
              'noreferrer'
            )
          }
        >
          <ListItemDecorator>
            <GitHub />
          </ListItemDecorator>{' '}
          GitHub
        </MenuItem>
      </Menu>
    </>
  )
}

export default MoreButton
