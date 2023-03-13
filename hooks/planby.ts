import React from 'react'

import { fetchChannels, fetchEpg } from '../planby'

import { Channel, Program, useEpg } from 'planby'

// Import theme
import { theme } from '../styles/planby-theme'
import { allQuestion } from '../types/video-edit'
import {
  convertToHoursCeil,
  formatHoursCeil,
  formatSeconds,
} from '../util/common'
import { epg } from '../planby/epg'
import { channels } from '../planby/channels'

// Example of globalStyles
// const globalStyles = `
// @import url('https://fonts.googleapis.com/css2?family=Antonio:wght@400;500;600&display=swap');
// .planby {
//   font-family: "Antonio", system-ui, -apple-system,
//     /* Firefox supports this but not yet system-ui */ "Segoe UI", Roboto,
//     Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; /* 2 */
// }
// `;

interface PlanbyData {
  channels: Channel[]
  egp: Program[]
}

export function useVideoTimeline(props: {
  allQuestion: allQuestion
  duration: number
}) {
  const { allQuestion, duration } = props

  const [planbyData, setPlanbyData] = React.useState<PlanbyData>({
    channels: [],
    egp: [],
  })
  // const [channels, setChannels] = React.useState<Channel[]>([])
  // const [epg, setEpg] = React.useState<Program[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const planbyDataMemo = React.useMemo(() => planbyData, [planbyData])
  // const channelsData = React.useMemo(() => channels, [channels])
  // const epgData = React.useMemo(() => epg, [epg])

  const handleFetchResources = React.useCallback(async () => {
    setIsLoading(true)
    const channelList: Channel[] = []
    const epgList: Program[] = []
    allQuestion.forEach((question) => {
      const channel: Channel = {
        // question.id
        uuid: question.id,
        logo: 'https://cdn-icons-png.flaticon.com/512/5184/5184592.png',
        position: { top: 0, height: 0 },
      }
      const program: Program = {
        // channelUuid: '1',
        channelUuid: question.id,
        id: question.id,
        title: question.title,
        description: question.questionType,
        since: `1970-01-01T${formatSeconds(question.start)}`,
        till: `1970-01-01T${formatSeconds(question.end)}`,
        image: 'https://cdn-icons-png.flaticon.com/512/5184/5184592.png',
      }
      channelList.push(channel)
      epgList.push(program)
    })
    setPlanbyData({ channels: channelList, egp: epgList })
    setIsLoading(false)
  }, [])

  React.useEffect(() => {
    handleFetchResources()
  }, [handleFetchResources])

  React.useEffect(() => {
    console.log('planbyDataMemo', planbyDataMemo)
  }, [planbyDataMemo])

  React.useEffect(() => {
    console.log(formatHoursCeil(duration) * 30)
  }, [duration])

  const { getEpgProps, getLayoutProps } = useEpg({
    channels: planbyDataMemo.channels,
    epg: planbyDataMemo.egp,
    // channels: channels as unknown as Channel[],
    // epg: epg as Program[],
    // dayWidth:
    //   formatHourCeil(duration) == 0 ? 300 : formatHourCeil(duration) * 300,
    // dayWidth: (formatHourCeil(duration + 2000) + 1) * 300,
    // dayWidth: formatHourCeil(duration + 2000) * 300 * 20,
    dayWidth: formatHoursCeil(duration) * 4000,
    sidebarWidth: 100,
    itemHeight: 80,
    isSidebar: true,
    isTimeline: true,
    isLine: true,
    startDate: '1970-01-01T00:00:00',
    // startDate: '1970-01-01T00:00:00',
    // endDate: '1970-01-01T01:00:00',
    endDate: `1970-01-01T${convertToHoursCeil(duration)}:00:00`,
    isBaseTimeFormat: true,
    theme,
  })

  return { getEpgProps, getLayoutProps, isLoading }
}
