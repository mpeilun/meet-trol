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
  handleQuestionClose: () => void
  data: RankData
}) {
  const data = props.data

  const shuffle = (array: string[]): string[] => {
    let arr = array.slice()
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const newArray = shuffle(data.options)
  const [items, setItems] = useState<string[]>(newArray)
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
    for (let i = 0; i < array.length; i++) {
      if (array[i] !== ans[i]) {
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
      .then((data) => console.log(data))
      .catch((error) => console.error(error))
    if (!data.isShowAnswer) {
      setIsReply(true)
      setIsAnsError({
        isShow: true,
        text: '請繼續作答',
        severity: 'info',
      })
    } else if (areArraysEqual(items)) {
      setIsReply(true)
      setIsAnsError({
        isShow: data.isShowAnswer,
        text: '正確',
        severity: 'success',
      })
    } else {
      setIsReply(true)
      setIsAnsError({
        isShow: data.isShowAnswer,
        text: '錯誤',
        severity: 'error',
      })
    }
  }

  resetServerContext()

  return (
    <Box sx={{ minWidth: 450, overFlowX: 'hidden' }}>
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h5" sx={{ fontWeight: 'bold', width: '100%' }}>
          {data.title??'排序題'}
        </Typography>
        <IconButton onClick={() => props.handleQuestionClose()}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Typography variant="body2" sx={{ pt: 1 }}>
        {data.content ?? ''}
      </Typography>

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
                      isDragDisabled={isReply}
                    >
                      {(provided, snapshot) => (
                        <ListItem
                          sx={{
                            transition: '.3s ease background-color',
                            bgcolor: snapshot.isDragging ? '#000' : '#fff',
                            position: 'relative',
                            border: isReply
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
                                p: 0.75,
                                mr: 1,
                                color: isReply
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
                                color: isReply
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
                                color: isReply
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
        </Box>
      </Box>
    </Box>
    //   </Card>
    // </Box>
  )
}
