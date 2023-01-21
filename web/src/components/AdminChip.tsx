import { Chip } from '@mui/joy'
import React from 'react'

interface AdminChipProps {
  admin: boolean | undefined
}
function AdminChip({ admin }: AdminChipProps) {
  return <>{admin === true && <Chip size="sm">Admin</Chip>}</>
}

export default AdminChip
