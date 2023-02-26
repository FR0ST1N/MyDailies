import * as ct from 'countries-and-timezones'

export const getTimezoneString = (timezone: ct.Timezone): string => {
  return `(${timezone.utcOffsetStr}) ${timezone.name}`
}

export const getTimezoneFromString = (
  formData: FormData
): string | undefined => {
  return formData.get('timezone')?.toString().split(' ')[1]
}
