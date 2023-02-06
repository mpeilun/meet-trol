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

interface alert {
  isShow: boolean
  text: string
  severity: AlertColor
}

export default function RankQuestion(props: {
  handleQuestionClose: () => void
}) {
  //   React.useEffect(() => {
  //     chrome.runtime.sendMessage(
  //       {
  //         contentScriptQuery: 'getOrderData',
  //       },
  //       function (response) {
  //         // console.log(response[0].items[0].title)
  //         // console.log(response[0].items[1].title)
  //         // console.log(response[0].questionTitle)
  //         // console.log(response[0]._id)

  //         setQuestionId(response[0]._id)
  //         setItems(shuffle(response[0].items)) // 暫時從資料庫第一筆讀取
  //         setQuestionTitle(response[0].questionTitle) // 未解決老師出哪一題 學生端就知道跳出哪一題
  //       }
  //     )
  //   }, [])

  //   const shuffle = (array: Array<Items>): Array<Items> => {
  //     for (let i = array.length - 1; i > 0; i--) {
  //       let j = Math.floor(Math.random() * (i + 1))
  //       ;[array[i], array[j]] = [array[j], array[i]]
  //     }
  //     return array
  //   }

  const initialItems: Array<{ title: string }> = [
    { title: 'findViewById 綁定物件' },
    { title: '建立物件變數' },
    { title: '完成component介面' },
  ]
  const ans: Array<{ title: string }> = [
    { title: '完成component介面' },
    { title: '建立物件變數' },
    { title: 'findViewById 綁定物件' },
  ]
  const [items, setItems] = useState(initialItems)

  const [questionId, setQuestionId] = useState('')
  const [questionTitle, setQuestionTitle] = useState('')

  const handleOnDragEnd = (result: DropResult): void => {
    if (!result.destination) return
    let newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, reorderedItem)
    setItems(newItems)
  }

  const areArraysEqual = (
    array1: Array<{ title: string }>,
    array2: Array<{ title: string }>
  ) => {
    for (let i = 0; i < array1.length; i++) {
      if (array1[i].title !== array2[i].title) {
        return false
      }
    }
    return true
  }

  const checkAns = () => {
    if (areArraysEqual(items, ans)) {
      console.log('correct')
      setIsAnsError({
        isShow: true,
        text: '正確',
        severity: 'success',
      })
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true)
        }, 750)
      }).then(() => {
        props.handleQuestionClose()
      })
    } else {
      setIsAnsError({
        isShow: true,
        text: '錯誤',
        severity: 'error',
      })
    }
  }

  //   const pushQ = () => {
  //     chrome.runtime.sendMessage(
  //       {
  //         contentScriptQuery: 'postOrderAns',
  //         questionId: questionId,
  //         qTitle: questionTitle,
  //         studentId: 'B0943005',
  //         items: items,
  //       },
  //       function (response) {
  //         // console.log(questionId), console.log(items), console.log(questionTitle)
  //       }
  //     )
  //     // console.log(questionTitle)
  //     // console.log(items)
  //     setQuestionTitle('')
  //     setItems([])
  //     props.setCloseS()
  //     props.setOpenR()
  //   }

  resetServerContext()

  const [isAnsError, setIsAnsError] = useState<alert>({
    isShow: false,
    text: '',
    severity: 'error',
  })

  return (
    // <Box
    //   sx={{
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     height: '100%',
    //   }}
    // >
    //   <Card
    //     sx={{
    //       width: '600px',

    //       // minHeight: '0',
    //       // position: 'absolute',
    //       // display: props.displayQuestion ? 'block' : 'none',
    //       // left: 0,
    //       // right: 0,
    //       // top: 0,
    //       // bottom: 0,
    //       // m: 'auto',
    //       // boxShadow: 10,
    //     }}
    //   >
    <Box>
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h5" sx={{ width: '100%' }}>
          排出建立component的順序
        </Typography>
        <IconButton sx={{}} onClick={() => props.handleQuestionClose()}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      {/* 拖曳 */}
      <Box
        sx={{
          overflow: 'hidden',
          overflowY: 'auto',

          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* <Typography textAlign="center" variant="h5">
    排序問題
  </Typography>
  <Typography variant="h6" color="#9e9e9e">
    題目
  </Typography>
  <Typography variant="h4" color="black">
    {questionTitle}
  </Typography>
  <Typography variant="h6" color="#9e9e9e">
    選項
  </Typography> */}

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="items">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {items.map(({ title }, index) => {
                  return (
                    <Draggable
                      key={`${index}${title}`}
                      draggableId={`${index}${title}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <ListItem
                          sx={{
                            transition: '.3s ease background-color',
                            bgcolor: snapshot.isDragging ? '#000' : '#fff',
                            position: 'relative',
                            border: '1.5px solid #212121',
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
                                p: 1,
                                mr: 1,
                                color: snapshot.isDragging ? '#fff' : '#000',
                              }}
                            />
                            <Box
                              component="span"
                              width="100%"
                              sx={{
                                color: snapshot.isDragging ? '#fff' : '#000',
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
                                color: snapshot.isDragging ? '#fff' : '#9e9e9e',
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
        <Button
          size="medium"
          variant="contained"
          color="secondary"
          fullWidth
          onClick={checkAns}
          disabled={items.length < 2 || items.length > 200}
        >
          送出
        </Button>
      </Box>
    </Box>
    //   </Card>
    // </Box>
  )
}
