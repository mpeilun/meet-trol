import * as React from 'react'
import {
  Button,
  IconButton,
  Box,
  Card,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  Divider,
  InputLabel,
  MenuItem,
} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import courseData from '../../store/course-data'
import { Delete } from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

interface ChapterData {
  title: string
  videoData: VideoData[]
}

interface VideoData {
  title: string
  url: string
}

export default function CreateCoursePage() {
  const [chapterSelector, setChapterSeletor] = useState('')
  const [chapter, setChapter] = useState<ChapterData[]>([]) //全部章節
  const [chapterDialogText, setChapterDialogText] = useState('') //Dialog輸入文字狀態(title)
  const [openChapterDialog, setOpenChapterDialog] = React.useState(false) //新增章節Dialog開關狀態

  // const [video, setVideo] = useState([]); //影片狀態
  const [videoDialogText, setVideoDialogText] = useState('') //Dialog輸入文字狀態
  const [openVideoDialog, setOpenVideoDialog] = React.useState(false) //新增影片Dialog開關狀態

  const [videoURL, setVideoURL] = useState('')

  const handleOpenChapterDialog = () => setOpenChapterDialog(true) //Dialog開
  const handleCloseChapterDialog = () => setOpenChapterDialog(false) //Dialog關

  const handleOpenVideoDialog = () => setOpenVideoDialog(true) //Dialog開
  const handleCloseVideoDialog = () => setOpenVideoDialog(false) //Dialog關

  const handleChangeChapter = (event) => {
    //改變ChapterDialog文字狀態
    setChapterDialogText(event.target.value)
  }

  const handleChangeURL = (event) => {
    //改變URL文字狀態
    setVideoURL(event.target.value)
  }

  const handleAddChapter = (newChapter: ChapterData) => {
    //增加章節名稱
    setChapter((prevState) => [...prevState, newChapter])
    console.log('chapter', chapter)
  }

  const handleDialogAndChapter = () => {
    //按下新增按鈕後，關掉Dialog，增加章節
    handleCloseChapterDialog()
    handleAddChapter({ title: chapterDialogText, videoData: [] })
  }

  const handleChangeVideo = (event) => {
    //改變VideoDialog文字狀態
    setVideoDialogText(event.target.value)
  }

  const handleAddVideo = (chapterId: string, newVideo: VideoData) => {
    const targetIndex = chapter.findIndex((item) => item.title === chapterId)
    if (targetIndex === -1) return

    setChapter((prev) => {
      prev[targetIndex].videoData = [...prev[targetIndex].videoData, newVideo]
      return prev
    })
  }
  function handleDeleteVideoData(videoDataToDelete: VideoData) {
    const targetChapterIndex = chapter.findIndex((chapter) =>
      chapter.videoData.includes(videoDataToDelete)
    )
    if (targetChapterIndex === -1) {
      return
    }
    const updatedChapter = [...chapter]
    updatedChapter[targetChapterIndex] = {
      ...updatedChapter[targetChapterIndex],
      videoData: updatedChapter[targetChapterIndex].videoData.filter(
        (videoData) => videoData !== videoDataToDelete
      ),
    }
    // 更新状态
    setChapter(updatedChapter)
  }
  const handleDialogAndVideo = (chapterId: string, newVideo: VideoData) => {
    //按下新增按鈕後，關掉Dialog，增加影片
    handleCloseVideoDialog()
    handleAddVideo(chapterId, newVideo)
  }
  // const handleInsert = () =>{

  //   setVideo(prevState=>[...chapter.slice(0,index),video,...chapter.slice(index)])
  // }

  const handleSelect = (event: SelectChangeEvent) => {
    //讀取位置
    setChapterSeletor(event.target.value)
  }

  return (
    <Box>
      <Card
        style={{ backgroundColor: '#F9F5E3' }}
        sx={{ mt: '1%', mr: '17%', ml: '17%' }}
      >
        <Box
          display="flex"
          justifyContent="start"
          flexDirection="column"
          sx={{ ml: '13%', width: 700 }}
        >
          <Box
            display={'flex'}
            flexDirection="row"
            sx={{ my: 2 }}
            bgcolor="#D4C5C7"
            width="100%"
          >
            <Typography sx={{ fontSize: 35, fontWeight: 'bold' }}>
              課程名稱:
            </Typography>
            <Typography sx={{ ml: 4, fontSize: 35, fontWeight: 'bold' }}>
              {/*這裡放課程名稱*/}行動裝置
            </Typography>
          </Box>

          {/* <Box>
            {video.map((item, index) => (
              <Typography key={index} sx={{fontSize:25}}>
                {item}
              </Typography>
              ))}
          </Box> */}

          {chapter.map((chapterItem, index) => (
            <Box key={`chapterItem-${index}`}>
              <Typography sx={{ fontSize: 25, mt: 3 }} fontWeight="bold">
                {chapterItem.title}
              </Typography>
              <Divider />
              {chapterItem.videoData.map((videoItem, index) => (
                <Box
                  key={`videoItem-${index}`}
                  display={'flex'}
                  flexDirection={'row'}
                >
                  <Typography fontSize={20}>{videoItem.title}</Typography>
                  <IconButton
                    color="primary"
                    onClick={() => handleDeleteVideoData(videoItem)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ))}

          <Box sx={{ mt: 15, mb: 8 }}>
            <Button
              onClick={handleOpenChapterDialog}
              variant="contained"
              size="medium"
              startIcon={<AddCircleOutlineIcon />}
            >
              新增章節
            </Button>
            <Button
              onClick={handleOpenVideoDialog}
              variant="contained"
              size="medium"
              sx={{ ml: 2 }}
              startIcon={<AddCircleOutlineIcon />}
            >
              新增影片
            </Button>
            <Dialog open={openChapterDialog} onClose={handleCloseChapterDialog}>
              <DialogTitle bgcolor={'#D4C5C7'} fontWeight="bold">
                新增章節
              </DialogTitle>

              <TextField
                required
                // id="outlined-required"
                // label="章節名稱"
                // style={{ backgroundColor: "#F4F2F3", borderRadius: "5px"  }}
                // sx={{mt:5}}
                sx={{ mx: 5, mt: 5, mb: 10, width: 300 }}
                autoFocus
                // margin="dense"
                id="name"
                label="名稱"
                fullWidth
                variant="standard"
                onChange={handleChangeChapter}
              ></TextField>
              <Button
                onClick={handleDialogAndChapter}
                variant="contained"
                sx={{ mx: 5, mb: 1 }}
              >
                新增
              </Button>
            </Dialog>

            <Dialog open={openVideoDialog} onClose={handleCloseVideoDialog}>
              <DialogTitle bgcolor={'#D4C5C7'} fontWeight="bold">
                新增影片
              </DialogTitle>

              <TextField
                required
                id="outlined-required"
                sx={{ mx: 5, my: 3, width: 300 }}
                autoFocus
                label="名稱"
                fullWidth
                variant="standard"
                onChange={handleChangeVideo}
              ></TextField>

              <Typography fontSize={17} sx={{ ml: 3 }}>
                選取章節
              </Typography>
              <FormControl sx={{ mx: 2, my: 2 }}>
                <InputLabel id="demo-simple-select-label"></InputLabel>
                <Select value={chapterSelector} onChange={handleSelect}>
                  {chapter.map((menuItem, index) => (
                    <MenuItem key={`menuItem-${index}`} value={menuItem.title}>
                      {menuItem.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="影片連結"
                onChange={handleChangeURL}
                sx={{ mb: 3, mx: 2 }}
              ></TextField>

              <Button
                onClick={() =>
                  handleDialogAndVideo(chapterSelector, {
                    title: videoDialogText,
                    url: videoURL,
                  })
                }
                variant="contained"
                sx={{ mx: 5, mb: 2 }}
              >
                新增
              </Button>
            </Dialog>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
