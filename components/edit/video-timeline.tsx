import React, { useEffect } from 'react'
import { Epg, Layout } from 'planby'

// Import hooks
import { useVideoTimeline } from '../../hooks/planby'

// Import components
import { Timeline, ChannelItem, Program } from '../planby'
import { allQuestion } from '../../types/video-edit'
import { formatHoursCeil } from '../../util/common'

function VideoTimeLine(props: { allQuestion: allQuestion; duration: number }) {
  const { allQuestion, duration } = props
  const { isLoading, getEpgProps, getLayoutProps } = useVideoTimeline({
    allQuestion: allQuestion,
    duration: duration,
  })

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Epg isLoading={isLoading} {...getEpgProps()}>
        <Layout
          {...getLayoutProps()}
          numberOfHoursInDay={formatHoursCeil(duration)}
          renderTimeline={(props) => (
            <Timeline {...props} isBaseTimeFormat={false} />
          )}
          renderProgram={({ program, ...rest }) => (
            <Program key={program.data.id} program={program} {...rest} />
          )}
          renderChannel={({ channel }) => (
            <ChannelItem key={channel.uuid} channel={channel} />
          )}
        />
      </Epg>
    </div>
  )
}

export default VideoTimeLine
