import dayjs, { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'

export function formatSeconds(value: number) {
  dayjs.extend(duration)
  return dayjs.duration(value, 'seconds').format('HH:mm:ss')
}

export function formatHoursCeil(value: number) {
  return Math.ceil(value / 3600)
}

export function convertToHoursCeil(seconds) {
  return Math.ceil(seconds / 3600)
    .toString()
    .padStart(2, '0')
}
