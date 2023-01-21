import { Divider, Grid, Sheet, Typography } from '@mui/joy'
import React from 'react'
import { CheckCircle } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import ColorModeButton from './ColorModeButton'
import MoreButton from './MoreButton'

function Header() {
  const navigate = useNavigate()
  return (
    <>
      <Sheet
        variant="plain"
        sx={{
          px: 2,
          py: 1,
        }}
      >
        <Grid alignItems="center" container direction="row" gap={1}>
          <Grid sx={{ flexGrow: 1 }}>
            <Typography
              level="h4"
              fontWeight="lg"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
              startDecorator={
                <CheckCircle color="var(--joy-palette-primary-plainColor)" />
              }
            >
              MyDailies
            </Typography>
          </Grid>
          <Grid>
            <ColorModeButton />
          </Grid>
          <Grid>
            <MoreButton />
          </Grid>
        </Grid>
      </Sheet>
      <Divider />
    </>
  )
}

export default Header
