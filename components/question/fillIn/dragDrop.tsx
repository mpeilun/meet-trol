import React from 'react'
import { Box, Typography, Grid } from '@mui/material'
import { useDrag } from 'react-dnd'
import FillItem from './fillItems'
import AnsItem from './ansItems'

interface items {
  id: number
  title: string
  url?: string
}
// 問題 list

const question = '欲新增按鈕要使用(Button)，並新增(OnClickListener)監聽事件。'
const regex = /(?<=\().+?(?=\))/g // 匹配所有單引號包含的文字
const answers = question.match(regex) // 使用 match 方法匹配字串// const questionArray: Array<items> = [
const questionElement = []

const questionComponent = () => {
  let isInsideBracket = false
  let answerIndex = 0
  for (let i = 0; i < question.length; i++) {
    const char = question[i]
    if (char === '(') {
      isInsideBracket = true
    } else if (isInsideBracket) {
      if (char === ')') {
        questionElement.push(
          <AnsItem index={i} ans={answers[answerIndex]}></AnsItem>
        )
        isInsideBracket = false
        answerIndex++
      }
    } else {
      questionElement.push(<span key={i}>{question[i]}</span>)
    }
  }
}
questionComponent()
//   { id: 0, title: '欲新增按鈕要使用' },
//   { id: 0, title: '並新增' },
//   { id: 0, title: '監聽點擊事件' },
// ]

// 答案 list
const ansArray = ['Button', 'OnClickListener', 'AlertDialog', 'Paper']

// BUG 英文不會自動換行

const DragDrop = () => {
  return (
    <>
      {/* questions */}
      <Box
        sx={{
          border: 2,
          px: 2,
          mr: 2,
          borderRadius: 2,
          // display: 'flex',
          // flexDirection: 'row',
          // justifyContent: 'space-around',
          minWidth: 350,
          minHeight: 300,
        }}
      >
        {questionElement}
        {/* <Grid container rowSpacing={2}>
          {questionArray.map((title, index) => {
            return (
              <>
                {ansArray.indexOf(title) == -1 ? (
                  <Grid
                    item
                    xs={8}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {title}
                    </Typography>
                  </Grid>
                ) : (
                  <Grid item xs={4}>
                    <AnsItem index={index} ans={title}></AnsItem>
                  </Grid>
                )}
              </>
            )
          })}
        </Grid> */}
      </Box>
      {/* answer items */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '100%',
          border: 2,
          px: 1,
          borderRadius: 2,
          minWidth: 250,
          minHeight: 300,
        }}
      >
        {ansArray.map((title, index) => {
          return (
            <>
              <FillItem title={title} index={index}></FillItem>
            </>
          )
        })}
      </Box>
    </>
  )
}

export default DragDrop
