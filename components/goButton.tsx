import { Button } from '@mui/material'
import { animated, useSpring } from '@react-spring/web'
import React from 'react'
import { sendMessage } from '../store/notification'
import { useAppDispatch } from '../hooks/redux'
import { useSession } from 'next-auth/react'

const GoButton = ({ handleModalOpen }: { handleModalOpen: () => void }) => {
  const dispatch = useAppDispatch()
  const { data: session } = useSession()

  const [hovered, setHovered] = React.useState(false)
  const { x } = useSpring({
    from: { x: 0 },
    x: hovered ? 1 : 0,
    config: { duration: 1000 },
  })

  React.useEffect(() => {
    const interval = setInterval(() => {
      setHovered((state) => !state)
    }, 1000)

    return () => clearInterval(interval)
  }, [hovered])

  return (
    <animated.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        scale: x.to({
          range: [0, 0.25, 0.5, 0.75, 1],
          output: [1, 0.95, 0.9, 0.95, 1],
        }),
      }}
    >
      <Button
        disableElevation
        variant="contained"
        size="large"
        onClick={
          session
            ? async () => {
                const testingCourseId = '6433dbbe63a37fb092f46f4b'
                const response = await fetch(
                  `/api/course/joint/${testingCourseId}`
                )
                if (response.status === 409 || response.status === 201) {
                  handleModalOpen()
                } else {
                  dispatch(
                    sendMessage({
                      severity: 'error',
                      message: '失敗！請重新嘗試',
                    })
                  )
                }
              }
            : () => {
                {
                  window.open('/auth/signin')
                }
              }
        }
        sx={{
          fontSize: '22px',
          fontWeight: 600,
          px: 3.5,
          py: 1,
          marginTop: '32px',
          borderRadius: 8,
        }}
      >
        {session ? '開始測試' : '點此登入'}
      </Button>
    </animated.div>
  )
}

export default React.memo(GoButton)
