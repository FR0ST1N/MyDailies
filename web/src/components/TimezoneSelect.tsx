import React from 'react'
import Autocomplete from '@mui/joy/Autocomplete'
import * as ct from 'countries-and-timezones'
import { getTimezoneString } from '../others/timezone'

const getTimezones = (): string[] => {
  return Object.values(ct.getAllTimezones())
    .sort((a, b) => {
      const x: number = a.utcOffset
      const y: number = b.utcOffset
      if (x < y) {
        return -1
      } else if (x > y) {
        return 1
      } else {
        return 0
      }
    })
    .map((value) => getTimezoneString(value))
}

function TimezoneSelect() {
  const timezones = getTimezones()
  return (
    <Autocomplete
      placeholder="Select timezone"
      options={timezones}
      name="timezone"
      sx={{ width: 350 }}
    />
  )
}

export default TimezoneSelect
