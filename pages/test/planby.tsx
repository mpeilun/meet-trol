import React from 'react'
import { Epg, Layout } from 'planby'

// Import hooks
import { usePlanby } from '../../hooks/planby'

// Import components
import { Timeline, ChannelItem, Program } from '../../components/planby'

function PlanbyPage() {
  const { isLoading, getEpgProps, getLayoutProps } = usePlanby()

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Epg isLoading={isLoading} {...getEpgProps()}>
        <Layout
          {...getLayoutProps()}
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

export default PlanbyPage
