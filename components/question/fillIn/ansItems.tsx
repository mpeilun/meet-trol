import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import { Box, Typography, Grid } from '@mui/material'

function AnsItem(props: {
  ans: string
  isReply: boolean
  isShowAnswer: boolean
  index: number
  setAns: React.Dispatch<React.SetStateAction<boolean[]>>
  yourAns: boolean[]
}) {
  const [ansUser, setAns] = useState('答案拖曳至此')
  const [color, setColor] = useState('grey')

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'text',
    drop: (item: { ans: string }) => {
      setAnswer(item.ans)
      setYourAnswer(item.ans)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))
  const [yorAnswer, setYourAnswer] = React.useState('')
  const setAnswer = (title: string) => {
    setAns(title)
  }

  const check = (ansUser: string) => {
    if (props.isReply && props.isShowAnswer) {
      if (props.ans == ansUser) {
        const newAns = [...props.yourAns]
        newAns[props.index] = true
        props.setAns(newAns)
        console.log(newAns)
        setColor('green')
      } else {
        const newAns = [...props.yourAns]
        newAns[props.index] = false
        props.setAns(newAns)
        setColor('red')
      }
    }
  }
  React.useEffect(() => {
    check(yorAnswer)
  }, [props.isReply])

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
          fontSize: '0.85rem',
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
        {ansUser}
      </Box>
    </Box>
  )
}

export default AnsItem
