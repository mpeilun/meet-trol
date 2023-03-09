import React from 'react'

import { fetchChannels, fetchEpg } from '../planby'

import { Channel, Program, useEpg } from 'planby'

// Import theme
import { theme } from '../styles/planby-theme'

// Example of globalStyles
// const globalStyles = `
// @import url('https://fonts.googleapis.com/css2?family=Antonio:wght@400;500;600&display=swap');
// .planby {
//   font-family: "Antonio", system-ui, -apple-system,
//     /* Firefox supports this but not yet system-ui */ "Segoe UI", Roboto,
//     Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; /* 2 */
// }
// `;

export function usePlanby() {
  const [channels, setChannels] = React.useState<Channel[]>([])
  const [epg, setEpg] = React.useState<Program[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const channelsData = React.useMemo(() => channels, [channels])
  const epgData = React.useMemo(() => epg, [epg])

  const { getEpgProps, getLayoutProps } = useEpg({
    channels: channelsData,
    epg: epgData,
    dayWidth: 7200,
    sidebarWidth: 100,
    itemHeight: 80,
    isSidebar: true,
    isTimeline: true,
    isLine: true,
    startDate: '2022-10-18T00:00:00',
    endDate: '2022-10-18T24:00:00',
    isBaseTimeFormat: true,
    theme,
  })

  const handleFetchResources = React.useCallback(async () => {
    setIsLoading(true)
    const epg = await fetchEpg()
    const channels = await fetchChannels()
    setEpg(epg as Program[])
    setChannels(channels as Channel[])
    setIsLoading(false)
  }, [])

  React.useEffect(() => {
    handleFetchResources()
  }, [handleFetchResources])

  return { getEpgProps, getLayoutProps, isLoading }
}
