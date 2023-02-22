import {
  Box,
  Checkbox,
  Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Fab,
} from '@mui/material'
import * as React from 'react'
import pisma from '../../prisma/prisma'
import { Info } from '@prisma/client'
import Choice from '../../components/question/choice/choice'

// 還需引入 description 圖片 src 變數
const Test = (props: { handleQuestionClose: () => void }) => {
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [url, setUrl] = React.useState('')
  const [checked, setChecked] = React.useState(false)
  const submitInfo = async () => {
    const response = await fetch('/api/interactiveData/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        content: content,
        url: url,
        start: 'test',
        end: 'test',
        firstJumps: checked,
        videoId: '63f45bc582f16bcec3a6381b', // video id
      }),
    })
    const data = await response.json()
    // console.log(data)
  }

  const deleteInfo = async () => {
    const response = await fetch('/api/interactiveData/info', {
      method: 'DELETE',
      body: JSON.stringify({
        id: '63f35f504e107a6cf440b72f', // info id
      }),
    })
    const data = await response.json()
    console.log(data)
  }

  const [infoData, setInfoData] = React.useState<Array<Info>>([])

  const videoId: string = '63f45bc582f16bcec3a6381b'
  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/interactiveData/info/${videoId}`)
      const json: Array<Info> = await response.json()
      setInfoData(json)
      console.log(json)
    }
    fetchData()
  }, [])
  return (
    <>
      <Box
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
      >
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
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(event) => {
                    setChecked(event.target.checked)
                    console.log(event.target.checked)
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Label"
            />
            <FormControlLabel
              disabled
              control={<Checkbox />}
              label="Disabled"
            />
          </FormGroup>

          <Button variant="contained" onClick={submitInfo}>
            送出
          </Button>
          <Button variant="contained" onClick={deleteInfo}>
            刪除
          </Button>
        </Box>
        <Box>
          <>
            <Choice handleQuestionClose={() => {}}></Choice>
          </>
        </Box>
      </Box>
    </>
  )
}

export default Test