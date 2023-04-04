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
  MenuItem,
  CircularProgress,
  Select,
} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useState } from 'react'
import { Delete } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { CourseWithDetail, ChapterWithDetail } from '../../types/course'
import { VideoCreateType } from '../../types/video'
import { Video } from '@prisma/client'
import Link from 'next/link'

export default function CreateCoursePage() {
  const router = useRouter()

  // Course Data
  const courseId = router.query.id as string
  const [course, setCourse] = useState<CourseWithDetail>()

  // Add Chapter Dialog State
  const [openChapterDialog, setOpenChapterDialog] = React.useState(false)
  const [chapterTitle, setChapterTitle] = useState('')

  // Add Video Dialog State
  const [openVideoDialog, setOpenVideoDialog] = React.useState(false)
  const [chapterIdSelector, setChapterIdSelector] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [videoURL, setVideoURL] = useState('')

  // Fetch Initial Data
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

  // Submit
  const handleAddChapter = async (newChapterTitle: string) => {
    const data = await fetch(`/api/chapter?courseId=${courseId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newChapterTitle,
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
    setOpenChapterDialog(false)
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
    setOpenVideoDialog(false)
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

  // const handleEditVideo = async (
  //   chapterId: string,
  //   videoId: string,
  //   newTitle: string,
  //   newURL: string
  // ) => {
  //   const targetIndex = course.chapters.findIndex(
  //     (item) => item.id === chapterId
  //   )
  //   if (targetIndex === -1) return

  //   const targetVideoIndex = course.chapters[targetIndex].videos.findIndex(
  //     (item) => item.id === videoId
  //   )
  //   if (targetVideoIndex === -1) return

  //   const data = await fetch(
  //     `/api/video?courseId${courseId}&chapterId=${chapterId}&videoId=${videoId}`,
  //     {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         ...course.chapters[targetIndex].videos[targetVideoIndex],
  //         title: newTitle,
  //         url: newURL,
  //       }),
  //     }
  //   )

  //   if (data.status == 201) {
  //     const result: Video = await data.json()
  //     setCourse((prevState) => {
  //       return {
  //         ...prevState,
  //         chapters: [
  //           ...prevState.chapters.slice(0, targetIndex),
  //           {
  //             ...prevState.chapters[targetIndex],
  //             videos: [
  //               ...prevState.chapters[targetIndex].videos.slice(
  //                 0,
  //                 targetVideoIndex
  //               ),
  //               result,
  //               ...prevState.chapters[targetIndex].videos.slice(
  //                 targetVideoIndex + 1
  //               ),
  //             ],
  //           },
  //           ...prevState.chapters.slice(targetIndex + 1),
  //         ],
  //       }
  //     })
  //   }
  //   handleClickClose()
  // }

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

          {/* Chapter & Video Item */}
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
            {/* Open Chapter Dialog */}
            <Button
              onClick={() => setOpenChapterDialog(true)}
              variant="contained"
              size="medium"
              startIcon={<AddCircleOutlineIcon />}
            >
              新增章節
            </Button>
            {/* Open Video Dialog */}
            <Button
              onClick={() => setOpenVideoDialog(true)}
              variant="contained"
              size="medium"
              sx={{ ml: 2 }}
              startIcon={<AddCircleOutlineIcon />}
            >
              新增影片
            </Button>

            {/* <Dialog open={openEdit} onClose={handleClickClose}>
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
            </Dialog> */}

            <Dialog
              open={openChapterDialog}
              onClose={() => setOpenChapterDialog(false)}
            >
              <DialogTitle bgcolor={'#D4C5C7'} fontWeight="bold">
                新增章節
              </DialogTitle>

              <TextField
                required
                sx={{ mx: 5, mt: 5, mb: 10, width: 300 }}
                autoFocus
                label="名稱"
                fullWidth
                variant="standard"
                onChange={(event) => setChapterTitle(event.target.value)}
              ></TextField>
              <Button
                onClick={() => handleAddChapter(chapterTitle)}
                variant="contained"
                sx={{ mx: 5, mb: 1 }}
              >
                新增
              </Button>
            </Dialog>

            <Dialog
              open={openVideoDialog}
              onClose={() => setOpenVideoDialog(true)}
            >
              <DialogTitle bgcolor={'#D4C5C7'} fontWeight="bold">
                新增影片
              </DialogTitle>

              <TextField
                required
                sx={{ mx: 5, my: 3, width: 300 }}
                autoFocus
                label="名稱"
                fullWidth
                variant="standard"
                onChange={(event) => setVideoTitle(event.target.value)}
              ></TextField>

              <Typography fontSize={17} sx={{ ml: 3 }}>
                選取章節
              </Typography>
              <FormControl sx={{ mx: 2, my: 2 }}>
                <Select
                  value={chapterIdSelector}
                  onChange={(event) => setChapterIdSelector(event.target.value)}
                >
                  {course.chapters.map((menuItem, index) => (
                    <MenuItem key={`menuItem-${index}`} value={menuItem.id}>
                      {menuItem.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="影片連結"
                onChange={(event) => setVideoURL(event.target.value)}
                sx={{ mb: 3, mx: 2 }}
              ></TextField>

              <Button
                onClick={() =>
                  handleAddVideo(chapterIdSelector, {
                    title: videoTitle,
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
