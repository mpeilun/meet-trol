import dayjs, { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'

export default function formatSeconds(value: number) {
  dayjs.extend(duration)
  return dayjs.duration(value, 'seconds').format('HH:mm:ss')
}
