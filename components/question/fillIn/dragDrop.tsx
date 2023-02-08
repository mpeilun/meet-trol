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
const questionArray: Array<items> = [
  { id: 0, title: '欲新增按鈕要使用' },
  { id: 0, title: '並新增' },
  { id: 0, title: '監聽點擊事件' },
]

// 答案 list
const ansArray: Array<items> = [
  { id: 0, title: 'Button' },
  { id: 0, title: 'OnClickListener' },
  { id: 0, title: 'AlerDialog' },
]

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
        }}
      >
        {questionArray.map(({ id, title }, index) => {
          if (index + 1 == questionArray.length) {
            return (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: '70px',
                  }}
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
                </Box>
              </>
            )
          } else
            return (
              <>
                <AnsItem
                  id={id}
                  title={title}
                  index={index}
                  ans={ansArray[index].title}
                ></AnsItem>
              </>
            )
        })}
      </Box>

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
        }}
      >
        {ansArray.map(({ id, title }, index) => {
          return (
            <>
              <FillItem id={id} title={title} index={index}></FillItem>
            </>
          )
        })}
      </Box>

      {/* answer items */}
    </>
  )
}

export default DragDrop
