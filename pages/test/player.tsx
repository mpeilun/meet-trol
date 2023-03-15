import ReactPlayer from 'react-player'

const Player = () => {
  console.log('render')
  return (
    <ReactPlayer
      url={'https://www.youtube.com/watch?v=zUHc0SplCAI'}
    ></ReactPlayer>
  )
}
export default Player
