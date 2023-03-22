import { Button } from '@mui/joy'
import React from 'react'
import { Eye, EyeOff } from 'react-feather'

interface PasswordInputDecoratorProps {
  show: boolean
  setShow: (show: boolean) => void
  size: 'sm' | 'md'
}
function PasswordInputDecorator({
  show,
  setShow,
  size,
}: PasswordInputDecoratorProps) {
  return (
    <Button size="sm" variant="plain" onClick={() => setShow(!show)}>
      {show ? (
        <EyeOff size={size === 'sm' ? 15 : 18} />
      ) : (
        <Eye size={size === 'sm' ? 15 : 18} />
      )}
    </Button>
  )
}

export default PasswordInputDecorator
