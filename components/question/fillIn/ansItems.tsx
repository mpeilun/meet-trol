import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import { Box, Typography, Grid } from '@mui/material'

function AnsItem(props: { ans: string }) {
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
    <Box
      component="span"
      sx={{ display: 'flex-inline', align: 'center', justify: 'center' }}
    >
      <Box
        component="span"
        ref={drop}
        sx={{
          color: { color },
          p: 0.5,
          px: 1,
          mx: 1,
          fontSize: 20,
          display: 'flex-inline',
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
  )
}

export default AnsItem
