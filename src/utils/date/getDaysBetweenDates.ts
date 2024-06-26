import Time from './Time.ts'

export function getDaysBetweenDates(startDate: string | Date, endDate: string | Date): number {
  const start = Time(startDate)
  const end = Time(endDate)
  return end.diff(start, 'days')
}
