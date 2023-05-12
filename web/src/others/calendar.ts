type WeekDay = (null | Date)[]

export const getDatesInMonth = (year: number, month: number) => {
  const monthDates: WeekDay[] = []

  const date = new Date(year, month, 1)
  // add null padding before month starts for week 1
  const week1: WeekDay = []
  let startDay = date.getDay()
  while (startDay--) {
    week1.push(null)
  }
  while (week1.length < 7) {
    week1.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  monthDates.push(week1)

  // Add remaining weeks
  let week: WeekDay = []
  while (date.getMonth() === month) {
    week.push(new Date(date))
    date.setDate(date.getDate() + 1)
    if (week.length === 7) {
      monthDates.push(week)
      week = []
    }
  }

  if (week.length > 0) {
    // Add padding for last week
    while (week.length < 7) {
      week.push(null)
    }
    monthDates.push(week)
  }
  return monthDates
}
