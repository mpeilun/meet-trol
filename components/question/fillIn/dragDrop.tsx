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

const question = '欲新增按鈕要使用"Button"，並新增"OnClickListener"監聽事件。'
const questionArray = question.split('"')
// const questionArray: Array<items> = [
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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          minWidth: 300,
          minHeight: 300,
        }}
      >
        {questionArray.map((title, index) => {
          if (ansArray.indexOf(title) == -1) {
            return (
              <Typography
                key={`dragdrop-question-${index}`}
                variant="body1"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {title}
              </Typography>
            )
          } else {
            return (
              <AnsItem
                key={`dragdrop-question-${index}`}
                index={index}
                ans={title}
              />
            )
          }
        })}
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
          minWidth: 300,
          minHeight: 300,
        }}
      >
        {ansArray.map((title, index) => {
          return (
            <FillItem
              key={`dragdrop-ans-${index}`}
              title={title}
              index={index}
            ></FillItem>
          )
        })}
      </Box>
    </>
  )
}

export default DragDrop
