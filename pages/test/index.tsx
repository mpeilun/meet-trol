import { Box, Divider, Button, TextField } from '@mui/material'
import * as React from 'react'
import pisma from '../../prisma/prisma'

// 還需引入 description 圖片 src 變數
const Test = (props: { handleQuestionClose: () => void }) => {
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [url, setUrl] = React.useState('')

  const submitInfo = async () => {
    const response = await fetch('/api/sendData/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        content: content,
        url: url,
        start: 'test',
        end: 'test',
        videoId: '63eb1cbe2d44163be0eeaf0a', // video id
      }),
    })
    const data = await response.json()
    // console.log(data)
  }

  const deleteInfo = async () =>{
    const response = await fetch('/api/sendData/info', {
      method: 'DELETE',
      body: JSON.stringify({
        id:'63ecc5c8128e12f8ea762197' // info id
      }),
    })
    const data = await response.json()
    console.log(data)
  }
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <TextField
          id="title"
          label="標題"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
          }}
        />
        <TextField
          id="content"
          label="內容"
          value={content}
          onChange={(event) => {
            setContent(event.target.value)
          }}
        />
        <TextField
          id="url"
          label="圖片網址"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value)
          }}
        />
        <Button variant="contained" onClick={submitInfo}>
          送出
        </Button>
        <Button variant="contained" onClick={deleteInfo}>
          刪除
        </Button>
      </Box>
    </>
  )
}

export default Test
