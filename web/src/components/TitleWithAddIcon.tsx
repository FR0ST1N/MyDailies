import { IconButton, Tooltip, Typography } from '@mui/joy'
import React from 'react'
import { PlusCircle } from 'react-feather'

interface TitleWithAddIconProps {
  title: string
  action: React.MouseEventHandler<HTMLButtonElement>
}
function TitleWithAddIcon({ title, action }: TitleWithAddIconProps) {
  return (
    <Typography
      level="h3"
      fontWeight="lg"
      sx={{ my: 1.5 }}
      endDecorator={
        <Tooltip title="Add">
          <IconButton onClick={action} variant="plain">
            <PlusCircle />
          </IconButton>
        </Tooltip>
      }
    >
      {title}
    </Typography>
  )
}

export default TitleWithAddIcon
