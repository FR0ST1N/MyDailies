import * as ct from 'countries-and-timezones'

export const getTimezoneString = (timezone: ct.Timezone): string => {
  return `(${timezone.utcOffsetStr}) ${timezone.name}`
}
