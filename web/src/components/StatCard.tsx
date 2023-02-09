import { Sheet, Typography } from '@mui/joy'
import React from 'react'

interface StatCardProps {
  title: string
  stat: number | undefined
}
export default function StatCard(props: StatCardProps) {
  const { title, stat } = props
  return (
    <Sheet
      variant="soft"
      color="neutral"
      sx={{
        padding: 2,
        borderRadius: '8px',
        minWidth: 150,
        userSelect: 'none',
      }}
    >
      <Typography level="body2" textAlign="center">
        {title}
      </Typography>
      <Typography level="body1" fontSize="lg" textAlign="center">
        {stat === undefined ? '0' : stat}
      </Typography>
    </Sheet>
  )
}
