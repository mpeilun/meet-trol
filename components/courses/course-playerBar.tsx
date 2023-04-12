import { FullScreenHandle } from 'react-full-screen'
import { ReactPlayerType } from '../../types/react-player'

// 播放器播放條
interface PlayerBarProps {
  showPlayerBar: boolean
  playedSeconds: number
  handleTimeSliderChange: (event: Event, value: number | number[]) => void
  handleVolumeSliderChange: (event: Event, value: number | number[]) => void
  handleChangeCommitted: (
    event: Event | React.SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => void
  playerRef: React.MutableRefObject<ReactPlayerType | null>
  playing: boolean
  volume: number
  setVolume: (value: number) => void
  play: () => void
  pause: () => void
  handleFullScreen: FullScreenHandle
  playbackRate: number
  setPlaybackRate: (value: number) => void
  setDisplayCreateDiscussion: (value: boolean) => void
}

const PlayerBar = ({
  showPlayerBar,
  playedSeconds,
  handleTimeSliderChange,
  handleVolumeSliderChange,
  handleChangeCommitted,
  playerRef,
  playing,
  play,
  pause,
  handleFullScreen,
  volume,
  setVolume,
  playbackRate,
  setPlaybackRate,
  setDisplayCreateDiscussion,
}: PlayerBarProps) => {

    return(
        <>
        </>
    )
}
export default PlayerBar
