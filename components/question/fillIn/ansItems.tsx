import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import { Box, Typography, Grid } from '@mui/material'

function AnsItem(props: {
  ans: string
  index: number
}) {
  const [ansUser, setAns] = useState('答案拖曳至此')
  const [color, setColor] = useState('grey')

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'text',
    drop: (item: { ans: string }) => setAnswer(item.ans),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const setAnswer = (title: string) => {
    setAns(title)
    check(title)
  }

  const check = (ansUser: string) => {
    if (props.ans == ansUser) {
      setColor('green')
    } else {
      setColor('red')
    }
  }

  // console.log(props.index)
  return (
    <>
      <Box
        // overflow="hidden"
        // textOverflow="ellipsis"
        // whiteSpace="normal"
        // ref={drag}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: '50px',
          // border: 3,
          // my: 2,
          // p: 1,
          // borderRadius: 2,
          // bgcolor: 'primary.light',
        }}
        // style={{
        //   color: 'white',
        //   borderColor: isDragging ? 'red' : 'black',
        // }}
      >
        <Box
          sx={{
            // pl: 1,
            display: 'flex',
            alignItems: 'center',
            // border: 3,
            // borderRadius: 2,
            // width: '50%',
            // height: '50%'
            // bgcolor: 'primary.light',
          }}
        >
          <Box
            ref={drop}
            sx={{
              fontSize: 12,
              color: { color },
              p: 1,
              display: 'flex',
              alignItems: 'center',
              border: 2,
              borderColor: 'black',
              borderRadius: 2,
              // width: '50%',
              // height: '50%',
              // bgcolor: 'primary.light',
            }}
          >
            {ansUser}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AnsItem
