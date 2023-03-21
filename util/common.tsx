import { Choice, Drag, Fill, Info, Rank } from '.prisma/client'
import dayjs, { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { Question } from '../types/video-edit'
import InfoIcon from '@mui/icons-material/Info'
import MenuIcon from '@mui/icons-material/Menu'
import CameraIcon from '@mui/icons-material/Camera'
import { blue, yellow, purple } from '@mui/material/colors'

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

export function checkQuestionType(question: Question) {
  switch (question.questionType) {
    case 'info':
      return question as Info
    case 'choice':
      return question as Choice
    case 'rank':
      return question as Rank
    case 'fill':
      return question as Fill
    case 'drag':
      return question as Drag
    default:
      console.error('%c' + 'Question type is not define', 'color: red')
      return undefined
  }
}

export function questionStyle(questionType: string) {
  switch (questionType) {
    case 'info':
      return {
        icon: <InfoIcon color="warning" />,
        color: yellow[500],
        displayName: '資訊卡',
      }
    case 'drag':
      return {
        icon: <CameraIcon color="secondary" />,
        color: purple[500],
        displayName: '圖選題',
      }
    case 'choice':
      return {
        icon: <CameraIcon color="primary" />,
        color: blue[500],
        displayName: '選擇題',
      }
    case 'rank':
      return {
        icon: <CameraIcon color="primary" />,
        color: blue[500],
        displayName: '排序題',
      }
    case 'fill':
      return {
        icon: <CameraIcon color="primary" />,
        color: blue[500],
        displayName: '填充題',
      }
    default: //'choice' | 'rank' | 'fill'
      return {
        icon: <MenuIcon color="primary" />,
        color: blue[500],
        displayName: '題目',
      }
  }
}
