import { invalidHabitId } from './consts'
import { EntryQueryParams } from './types'

export const getEntryRequestObject = (
  id: string | undefined
): EntryQueryParams => {
  if (id === undefined) {
    throw invalidHabitId
  }
  const idNum = +id
  const date = new Date()
  return {
    id: idNum,
    year: date.getFullYear(),
    month: date.getMonth(),
  }
}
