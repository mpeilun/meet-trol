import React from 'react'
import { VideoData } from '../../types/chapter'
import { Info, Choice, Rank, Fill, Drag } from '@prisma/client'
import { useTransition, animated } from '@react-spring/web'
import { useAppSelector } from '../../hooks/redux'

type props = {
  play: () => void
  pause: () => void
  interactionData: (Info | Choice | Rank | Fill | Drag)[]
}

const Interaction = ({ play, pause, interactionData }: props) => {
  const playerSecond = useAppSelector((state) => state.course.playedSecond)
  
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        position: 'absolute',
      }}
    >
      {interactionData.map((data, index) => {
        return (
          <p key={`interactive question ${index} - key`}>{playerSecond}</p>
        )
      })}
    </div>
  )
}

export default React.memo(Interaction)
