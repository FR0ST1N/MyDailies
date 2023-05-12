import * as ct from 'countries-and-timezones'

export const getTimezoneString = (timezone: ct.Timezone | null): string => {
  if (timezone === null) {
    return 'Invalid timezone'
  }
  return `(${timezone.utcOffsetStr}) ${timezone.name}`
}

export const getTimezoneFromString = (
  formData: FormData
): string | undefined => {
  return formData.get('timezone')?.toString().split(' ')[1]
}
