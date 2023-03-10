import dayjs, { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'

export function formatSeconds(value: number) {
  dayjs.extend(duration)
  return dayjs.duration(value, 'seconds').format('HH:mm:ss')
}

export function formatHourCeil(value: number) {
  return Math.ceil(value / 3600)
}
