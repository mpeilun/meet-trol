import React, { useEffect } from 'react'
import { Epg, Layout } from 'planby'

// Import hooks
import { useVideoTimeline } from '../../hooks/planby'

// Import components
import { Timeline, ChannelItem, Program } from '../planby'
import { allQuestion } from '../../types/video-edit'
import { formatHourCeil } from '../../util/common'

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
          renderTimeline={(props) => (
            <Timeline
              {...props}
              isBaseTimeFormat={false}
              // numberOfHoursInDay={1}
              numberOfHoursInDay={
                formatHourCeil(duration) === 0 ? 1 : formatHourCeil(duration)
              }
            />
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
