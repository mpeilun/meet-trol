import React, { useState } from 'react'

import {
  Box,
  Card,
  Divider,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  AlertColor,
  Collapse,
  Alert,
  ListItemSecondaryAction,
} from '@mui/material'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import { resetServerContext } from 'react-beautiful-dnd'
import { RankData } from '../../../types/chapter'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

interface alert {
  isShow: boolean
  text: string
  severity: AlertColor
}

export default function RankQuestion(props: {
  close: () => void
  handleQuestionClose: () => void
  data: RankData
  isLog: boolean
  feedbackIndex: number
}) {
  const data = props.data
  const isLog = props.isLog
  const feedbackIndex = props.feedbackIndex

  const shuffle = React.useMemo((): string[] => {
    let arr = data.options.slice()
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [data.options])

  const [items, setItems] = useState<string[]>(
    isLog && data.feedback[0] != null
      ? data.feedback[feedbackIndex].answers
      : isLog
      ? data.options
      : shuffle
  )
  const [isReply, setIsReply] = React.useState(false)
  const [isAnsError, setIsAnsError] = useState<alert>({
    isShow: false,
    text: '',
    severity: 'error',
  })
  const handleOnDragEnd = (result: DropResult): void => {
    setIsAnsError({
      isShow: false,
      text: '',
      severity: isAnsError.severity,
    })
    if (!result.destination) return
    let newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, reorderedItem)
    setItems(newItems)
  }

  const areArraysEqual = (array: string[]) => {
    // console.log(array)
    const ans = data.options
    // console.log(ans)
    // console.log(ans)
    for (let i = 0; i < array.length; i++) {
      if (array[i] !== ans[i]) {
        // console.log(ans[i])
        return false
      }
    }
    return true
  }

  const checkAns = () => {
    fetch('/api/interactiveData/rank/pushAns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: items, rankId: data.id }),
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => console.error(error))

    //   if (!data.isShowAnswer) {
    //   setIsReply(true)
    //   setIsAnsError({
    //     isShow: true,
    //     text: '請繼續作答',
    //     severity: 'info',
    //   })
    // } else
    if (areArraysEqual(items)) {
      console.log('correct')
      setIsReply(true)
      setIsAnsError({
        // isShow: data.isShowAnswer,
        isShow: true,
        text: '正確',
        severity: 'success',
      })
    } else {
      console.log('error')
      setIsReply(true)
      setIsAnsError({
        // isShow: data.isShowAnswer,
        isShow: true,
        text: '錯誤',
        severity: 'error',
      })
    }
  }

  resetServerContext()

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  return (
    <Box sx={{ minWidth: 450, overFlowX: 'hidden' }}>
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h4" sx={{ fontWeight: 'bold', width: '100%' }}>
          {data.title ?? '排序題'}
        </Typography>
        <IconButton
          onClick={async () => {
            props.close()
            // await delay(200)
            props.handleQuestionClose()
          }}
        >
          <CloseIcon sx={{fontSize:40, color: 'black'}}/>
        </IconButton>
      </Box>
      <Divider />
      {data.question && (
        <Typography
          sx={{ pt: 1, fontSize: 24, letterSpacing: 1 }}
        >
          {data.question ?? ''}
        </Typography>
      )}

      {/* 拖曳 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="items">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((title, index) => {
                  return (
                    <Draggable
                      key={`${index}${title}`}
                      draggableId={`${index}${title}`}
                      index={index}
                      isDragDisabled={isLog ? true : isReply}
                    >
                      {(provided, snapshot) => (
                        <ListItem
                          sx={{
                            transition: '.3s ease background-color',
                            bgcolor: snapshot.isDragging ? '#000' : '#fff',
                            position: 'relative',
                            border: isLog
                              ? '1.5px solid grey'
                              : isReply
                              ? '1.5px solid grey'
                              : '1.5px solid #212121',
                            mb: 1,
                            borderRadius: '8px',
                            '& .MuiTypography-root': {
                              display: 'flex',
                              alignItems: 'center',
                            },
                          }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ListItemText>
                            <MenuIcon
                              sx={{
                                // p: 0.75,
                                mr: 1,
                                color: isLog
                                  ? 'grey'
                                  : isReply
                                  ? 'grey'
                                  : snapshot.isDragging
                                  ? '#fff'
                                  : '#000',
                              }}
                            />
                            <Box
                              component="span"
                              width="100%"
                              sx={{
                                fontSize: 20,
                                color: isLog
                                  ? 'grey'
                                  : isReply
                                  ? 'grey'
                                  : snapshot.isDragging
                                  ? '#fff'
                                  : '#000',
                              }}
                            >
                              {title}
                            </Box>
                            <Box
                              component="span"
                              width="100%"
                              position="absolute"
                              top="0"
                              left="6px"
                              fontSize=".7rem"
                              sx={{
                                color: isLog
                                  ? 'grey'
                                  : isReply
                                  ? 'grey'
                                  : snapshot.isDragging
                                  ? '#fff'
                                  : '#9e9e9e',
                              }}
                            >
                              {index + 1}
                            </Box>
                          </ListItemText>
                        </ListItem>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
        <Collapse in={isAnsError.isShow}>
          <Alert severity={isAnsError.severity} sx={{ mb: 2 }}>
            {isAnsError.text}
          </Alert>
        </Collapse>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {isReply && data.note && (
            <Button
              disableElevation
              type="button"
              variant="contained"
              onClick={() => {
                setIsAnsError({
                  isShow: true,
                  text: data.note ?? '',
                  severity: 'info',
                })
              }}
              sx={{ width: 125, fontWeight: 'bold', borderRadius: 16 }}
            >
              詳解
            </Button>
          )}
          <Box></Box>
          {!props.isLog && (
            <Button
              disableElevation
              type="submit"
              variant="contained"
              disabled={isReply}
              startIcon={<CheckCircleOutlineIcon />}
              sx={{
                bgcolor: '#82CD00',
                '&:hover': {
                  backgroundColor: '#54B435',
                  color: 'white',
                },
                width: 125,
                fontWeight: 'bold',
                borderRadius: 16,
              }}
              onClick={checkAns}
            >
              送出
            </Button>
          )}
        </Box>
      </Box>
    </Box>
    //   </Card>
    // </Box>
  )
}
