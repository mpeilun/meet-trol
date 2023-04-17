import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import { Box, Typography, Grid } from '@mui/material'

function AnsItem(props: {
  ans: string
  isReply: boolean
  isShowAnswer: boolean
  index: number
  setMyAnswer: React.Dispatch<React.SetStateAction<string[]>>
  myAnswer: string[]
}) {
  const [answers, setAnswer] = useState('答案拖曳至此')
  const [color, setColor] = useState<string>('grey')
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'text',
    drop: (item: { ans: string }) => {
      setAnswer(item.ans)
      let newAnswer: string[] = props.myAnswer
      newAnswer[props.index] = item.ans
      // console.log(newAnswer)
      props.setMyAnswer(newAnswer)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

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
          fontWeight: 'bold',
          fontSize: 20,
          display: 'flex-inline',
          alignItems: 'center',
          border: 2,
          borderColor: isOver ? 'red' : 'black',
          borderRadius: 2,
          // width: '50%',
          // height: '50%',
          // bgcolor: 'primary.light',
        }}
      >
        {answers}
      </Box>
    </Box>
  )
}

export default AnsItem
