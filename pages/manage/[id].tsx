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
  CircularProgress,
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
import { useRouter } from 'next/router'
import { CourseWithDetail, ChapterWithDetail } from '../../types/course'
import { VideoCreateType } from '../../types/video'
import { Video } from '@prisma/client'
import Link from 'next/link'

export default function CreateCoursePage() {
  const router = useRouter()
  const courseId = router.query.id as string

  const [chapterIdSelector, setChapterIdSelector] = useState('')
  const [course, setCourse] = useState<CourseWithDetail>()
  // const [chapter, setChapter] = useState<ChapterWithDetail[]>([]) //全部章節
  const [chapterDialogText, setChapterDialogText] = useState('') //Dialog輸入文字狀態(title)
  const [openChapterDialog, setOpenChapterDialog] = React.useState(false) //新增章節Dialog開關狀態

  // const [video, setVideo] = useState([]); //影片狀態
  const [videoDialogText, setVideoDialogText] = useState('') //Dialog輸入文字狀態
  const [openVideoDialog, setOpenVideoDialog] = React.useState(false) //新增影片Dialog開關狀態

  const [videoURL, setVideoURL] = useState('')

  //Fetch Initial Data
  React.useEffect(() => {
    if (!router.isReady) return
    const fetchData = async () => {
      const res = await fetch(`/api/course?courseId=${courseId}`)
      const data: CourseWithDetail = await res.json()
      setCourse(data)
      console.log(data)
    }
    fetchData()
  }, [router.isReady])

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

  const handleAddChapter = async (newChapter: string) => {
    const data = await fetch(`/api/course?courseId=${courseId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newChapter,
      }),
    })
    if (data.status == 201) {
      const result: ChapterWithDetail = await data.json()
      setCourse((prevState) => {
        return {
          ...prevState,
          chapters: [...prevState.chapters, { ...result, videos: [] }],
        }
      })
    } else {
      console.log('error')
    }
    handleCloseChapterDialog()
  }

  const handleChangeVideo = (event) => {
    //改變VideoDialog文字狀態
    setVideoDialogText(event.target.value)
  }

  const handleAddVideo = async (
    chapterId: string,
    newVideo: VideoCreateType
  ) => {
    const targetIndex = course.chapters.findIndex(
      (item) => item.id === chapterId
    )
    if (targetIndex === -1) return

    const data = await fetch(
      `/api/video?courseId=${courseId}&chapterId=${chapterId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newVideo.title,
          url: newVideo.url,
        }),
      }
    )

    if (data.status == 201) {
      const result: Video = await data.json()
      setCourse((prevState) => {
        return {
          ...prevState,
          chapters: [
            ...prevState.chapters.slice(0, targetIndex),
            {
              ...prevState.chapters[targetIndex],
              videos: [...prevState.chapters[targetIndex].videos, result],
            },
            ...prevState.chapters.slice(targetIndex + 1),
          ],
        }
      })
    } else {
      console.log('error')
    }
    handleCloseVideoDialog()
  }

  async function handleDeleteVideo(chapterId: string, videoId: string) {
    const targetIndex = course.chapters.findIndex(
      (item) => item.id === chapterId
    )
    if (targetIndex === -1) return

    const data = await fetch(
      `/api/video?courseId=${courseId}&chapterId=${chapterId}&videoId=${videoId}`,
      {
        method: 'DELETE',
      }
    )

    if (data.status == 200) {
      setCourse((prevState) => {
        return {
          ...prevState,
          chapters: [
            ...prevState.chapters.slice(0, targetIndex),
            {
              ...prevState.chapters[targetIndex],
              videos: [
                ...prevState.chapters[targetIndex].videos.filter(
                  (item) => item.id !== videoId
                ),
              ],
            },
            ...prevState.chapters.slice(targetIndex + 1),
          ],
        }
      })
    } else {
      console.log('error')
    }
  }

  const [openEdit, setOpenEdit] = useState(false) //修改Dialog的狀態
  const handleClickOpen = () => setOpenEdit(true)
  const handleClickClose = () => setOpenEdit(false)
  const [editTitle, setEditTitle] = useState('') //修改後title狀態
  const handleTitleChange = (e) => {
    setEditTitle(e.target.value)
  }
  const [editURL, setEditURL] = useState('') //修改後url狀態
  const handleURLChange = (e) => {
    setEditURL(e.target.value)
  }
  const handleEditVideo = async (
    chapterId: string,
    videoId: string,
    newTitle: string,
    newURL: string
  ) => {
    const targetIndex = course.chapters.findIndex(
      (item) => item.id === chapterId
    )
    if (targetIndex === -1) return

    const targetVideoIndex = course.chapters[targetIndex].videos.findIndex(
      (item) => item.id === videoId
    )
    if (targetVideoIndex === -1) return

    const data = await fetch(
      `/api/video?courseId${courseId}&chapterId=${chapterId}&videoId=${videoId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...course.chapters[targetIndex].videos[targetVideoIndex],
          title: newTitle,
          url: newURL,
        }),
      }
    )

    if (data.status == 201) {
      const result: Video = await data.json()
      setCourse((prevState) => {
        return {
          ...prevState,
          chapters: [
            ...prevState.chapters.slice(0, targetIndex),
            {
              ...prevState.chapters[targetIndex],
              videos: [
                ...prevState.chapters[targetIndex].videos.slice(
                  0,
                  targetVideoIndex
                ),
                result,
                ...prevState.chapters[targetIndex].videos.slice(
                  targetVideoIndex + 1
                ),
              ],
            },
            ...prevState.chapters.slice(targetIndex + 1),
          ],
        }
      })
    }
    handleClickClose()
  }

  const handleSelect = (event: SelectChangeEvent) => {
    setChapterIdSelector(event.target.value)
  }

  if (!course)
    return (
      <CircularProgress
        sx={{
          display: 'block',
          margin: '24px auto',
        }}
      />
    )

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
              {course.title}
            </Typography>
          </Box>

          {/* <Box>
            {video.map((item, index) => (
              <Typography key={index} sx={{fontSize:25}}>
                {item}
              </Typography>
              ))}
          </Box> */}

          {course.chapters.map((chapterData, index) => (
            <Box key={`chapterItem-${index}`}>
              <Typography sx={{ fontSize: 25, mt: 3 }} fontWeight="bold">
                {chapterData.title}
              </Typography>
              <Divider />
              {chapterData.videos.map((videoData, index) => (
                <Box
                  key={`videoItem-${index}`}
                  display={'flex'}
                  flexDirection={'row'}
                >
                  <Link
                    href={`/courses/edit/${videoData.id}`}
                    passHref
                    legacyBehavior
                  >
                    <Typography component={'a'} fontSize={20}>
                      {videoData.title}
                    </Typography>
                  </Link>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      handleDeleteVideo(chapterData.id, videoData.id)
                    }
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

            <Dialog open={openEdit} onClose={handleClickClose}>
              <DialogTitle bgcolor={'#D4C5C7'} fontWeight="bold">
                修改影片
              </DialogTitle>

              <TextField
                required
                id="outlined-required"
                sx={{ mx: 5, my: 3, width: 300 }}
                autoFocus
                label="名稱"
                fullWidth
                variant="standard"
                onChange={handleTitleChange}
              ></TextField>
              <TextField
                label="影片連結"
                onChange={handleURLChange}
                sx={{ mb: 3, mx: 2 }}
              ></TextField>

              <Button
                // onClick={}
                variant="contained"
                sx={{ mx: 5, mb: 2 }}
              >
                修改影片
              </Button>
            </Dialog>

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
                onClick={() => handleAddChapter(chapterDialogText)}
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
                <Select value={chapterIdSelector} onChange={handleSelect}>
                  {course.chapters.map((menuItem, index) => (
                    <MenuItem key={`menuItem-${index}`} value={menuItem.id}>
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
                  handleAddVideo(chapterIdSelector, {
                    title: videoDialogText,
                    url: videoURL,
                    description: '',
                    material: '',
                    chapterId: chapterIdSelector,
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
