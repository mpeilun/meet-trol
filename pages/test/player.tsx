import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import {
  useTransition,
  animated,
  useSpringRef,
  config,
  useChain,
  useSpring,
} from '@react-spring/web'
import styles from './player.module.css'
import { Box, Button } from '@mui/material'

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })
const Player = () => {
  const data = [
    {
      name: 'Rare Wind',
      description: '#a8edea → #fed6e3',
      css: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      height: 200,
    },
    {
      name: 'Saint Petersburg',
      description: '#f5f7fa → #c3cfe2',
      css: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      height: 400,
    },
    {
      name: 'Deep Blue',
      description: '#e0c3fc → #8ec5fc',
      css: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      height: 400,
    },
    {
      name: 'Ripe Malinka',
      description: '#f093fb → #f5576c',
      css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      height: 400,
    },
    {
      name: 'Perfect White',
      description: '#fdfbfb → #ebedee',
      css: 'linear-gradient(135deg, #E3FDF5 0%, #FFE6FA 100%)',
      height: 400,
    },
    {
      name: 'Near Moon',
      description: '#5ee7df → #b490ca',
      css: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
      height: 400,
    },
    {
      name: 'Wild Apple',
      description: '#d299c2 → #fef9d7',
      css: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      height: 200,
    },
    {
      name: 'Ladoga Bottom',
      description: '#ebc0fd → #d9ded8',
      css: 'linear-gradient(135deg, #ebc0fd 0%, #d9ded8 100%)',
      height: 400,
    },
    {
      name: 'Sunny Morning',
      description: '#f6d365 → #fda085',
      css: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      height: 200,
    },
    {
      name: 'Lemon Gate',
      description: '#96fbc4 → #f9f586',
      css: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
      height: 400,
    },
    {
      name: 'Salt Mountain',
      description: ' #FFFEFF → #D7FFFE',
      css: 'linear-gradient(135deg, #FFFEFF 0%, #D7FFFE 100%)',
      height: 200,
    },
    {
      name: 'New York',
      description: ' #fff1eb → #ace0f9',
      css: 'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)',
      height: 400,
    },
    {
      name: 'Soft Grass',
      description: ' #c1dfc4 → #deecdd',
      css: 'linear-gradient(135deg, #c1dfc4 0%, #deecdd 100%)',
      height: 400,
    },
    {
      name: 'Japan Blush',
      description: ' #ddd6f3 → #faaca8',
      css: 'linear-gradient(135deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)',
      height: 200,
    },
  ]

  const [open, set] = useState(false)

  const springApi = useSpringRef()
  const { size, ...rest } = useSpring({
    ref: springApi,
    config: config.stiff,
    from: { opacity: 1, size: '20%', background: 'hotpink' },
    to: {
      size: open ? '50%' : '20%',
      background: open ? 'white' : 'hotpink',
    },
  })

  const transApi = useSpringRef()
  const transition = useTransition(open ? [data[0]] : [], {
    ref: transApi,
    trail: 0,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
  })

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  useChain(open ? [springApi, transApi] : [transApi, springApi], [0, 0])

  return (
    <div className={styles.wrapper}>
      <animated.div
        style={{ ...rest, width: size, height: size }}
        className={styles.button}
        onClick={() => {
          open ? '' : set((open) => !open)
        }}
      >
        {transition((style, item) => (
          <animated.div
            className={styles.item}
            style={{ ...style, background: item.css }}
          >
            <Box>
              <Button
                onClick={() => {
                  set((open) => !open)
                }}
              >
                Hi
              </Button>
              <p>{item.name}</p>
            </Box>
          </animated.div>
        ))}
      </animated.div>
    </div>
  )
  // return (
  //   <div>
  //     <ReactPlayer
  //       url={'https://www.youtube.com/watch?v=zUHc0SplCAI'}
  //     ></ReactPlayer>
  //   </div>
  // )
}
export default Player
