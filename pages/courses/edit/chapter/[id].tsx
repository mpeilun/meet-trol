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
  InputLabel,
  Tooltip,
} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useState } from 'react'
import { Delete } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { CourseWithDetail, ChapterWithDetail } from '../../../../types/course'
import { VideoCreateType } from '../../../../types/video'
import { Video } from '@prisma/client'
import Link from 'next/link'
import BodyLayout from '../../../../components/layout/common-body'
import { useDispatch } from 'react-redux'
import { sendMessage } from '../../../../store/notification'
import EditIcon from '@mui/icons-material/Edit'
import { title } from 'process'

export default function CreateCoursePage() {
  const router = useRouter()
  const dispatch = useDispatch()

  // Course Data
  const courseId = router.query.id as string
  const [course, setCourse] = useState<CourseWithDetail>()

  // Add Chapter Dialog State
  const [openChapterDialog, setOpenChapterDialog] = React.useState(false)
  const [chapterTitle, setChapterTitle] = useState('')
  const [chapterEdit, setChapterEdit] = useState(false)

  // Add Video Dialog State
  const [openVideoDialog, setOpenVideoDialog] = React.useState(false)
  const [chapterIdSelector, setChapterIdSelector] = useState('')
  const [videoIdSelector, setVideoIdSelector] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [videoURL, setVideoURL] = useState('')
  const [videoEdit, setVideoEdit] = useState(false)

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

  // Handel Dialog
  const handleChapterDialogOpen = (edit?: boolean) => {
    if (edit) {
      setChapterEdit(true)
    }
    setOpenChapterDialog(true)
  }

  const handleChapterDialogClose = () => {
    setOpenChapterDialog(false)
    setChapterTitle('')
    setTimeout(() => {
      setChapterEdit(false)
    }, 20)
  }

  const handleVideoDialogOpen = (edit?: boolean) => {
    if (edit) {
      setVideoEdit(true)
    }
    setOpenVideoDialog(true)
  }

  const handleVideoDialogClose = (edit?: boolean) => {
    setOpenVideoDialog(false)
    setVideoTitle('')
    setVideoURL('')
    setTimeout(() => {
      setVideoEdit(false)
    }, 20)
  }

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
      dispatch(
        sendMessage({
          severity: 'success',
          message: '新增成功',
          duration: 'short',
        })
      )
    } else {
      dispatch(
        sendMessage({
          severity: 'error',
          message: '新增失敗',
          duration: 'short',
        })
      )
    }
    setOpenChapterDialog(false)
  }

  const handleEditChapter = async (newChapterTitle: string) => {
    const data = await fetch(
      `/api/chapter?courseId=${courseId}&chapterId=${chapterIdSelector}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newChapterTitle,
        }),
      }
    )
    if (data.status == 201) {
      const result: ChapterWithDetail = await data.json()
      setCourse((prevState) => {
        return {
          ...prevState,
          chapters: prevState.chapters.map((item) => {
            if (item.id === chapterIdSelector) {
              return {
                ...item,
                title: newChapterTitle,
              }
            }
            return item
          }),
        }
      })
      handleChapterDialogClose()
      dispatch(
        sendMessage({
          severity: 'success',
          message: '新增成功',
          duration: 'short',
        })
      )
    } else {
      dispatch(
        sendMessage({
          severity: 'error',
          message: '新增失敗',
          duration: 'short',
        })
      )
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
      dispatch(
        sendMessage({
          severity: 'success',
          message: '新增成功',
          duration: 'short',
        })
      )
    } else {
      dispatch(
        sendMessage({
          severity: 'error',
          message: '新增失敗',
          duration: 'short',
        })
      )
    }
    WebGLActiveInfo
    setOpenVideoDialog(false)
  }

  async function handleDeleteCourse() {
    const data = await fetch(`/api/course?courseId=${courseId}`, {
      method: 'DELETE',
    })

    if (data.status == 200) {
      router.push('/courses/edit')
      dispatch(
        sendMessage({
          severity: 'success',
          message: '刪除成功',
          duration: 'short',
        })
      )
    } else {
      dispatch(
        sendMessage({
          severity: 'error',
          message: '刪除失敗',
          duration: 'short',
        })
      )
    }
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
      dispatch(
        sendMessage({
          severity: 'success',
          message: '刪除成功',
          duration: 'short',
        })
      )
    } else {
      dispatch(
        sendMessage({
          severity: 'error',
          message: '刪除失敗',
          duration: 'short',
        })
      )
    }
  }

  async function handleDeleteChapter(chapterId: string) {
    const data = await fetch(
      `/api/chapter?courseId=${courseId}&chapterId=${chapterId}`,
      {
        method: 'DELETE',
      }
    )

    if (data.status == 200) {
      setCourse((prevState) => {
        return {
          ...prevState,
          chapters: [
            ...prevState.chapters.filter((item) => item.id !== chapterId),
          ],
        }
      })
      dispatch(
        sendMessage({
          severity: 'success',
          message: '刪除成功',
          duration: 'short',
        })
      )
    } else {
      dispatch(
        sendMessage({
          severity: 'error',
          message: '刪除失敗',
          duration: 'short',
        })
      )
    }
  }

  const handleEditVideo = async (newTitle: string, newURL: string) => {
    const targetIndex = course.chapters.findIndex(
      (item) => item.id === chapterIdSelector
    )
    if (targetIndex === -1) return

    const targetVideoIndex = course.chapters[targetIndex].videos.findIndex(
      (item) => item.id === videoIdSelector
    )
    if (targetVideoIndex === -1) return

    const { id, ...videoDropId } =
      course.chapters[targetIndex].videos[targetVideoIndex]

    const data = await fetch(
      `/api/video?courseId=${courseId}&chapterId=${chapterIdSelector}&videoId=${videoIdSelector}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...videoDropId,
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
      handleVideoDialogClose()
      dispatch(
        sendMessage({
          severity: 'success',
          message: '修改成功',
          duration: 'short',
        })
      )
    } else {
      dispatch(
        sendMessage({
          severity: 'error',
          message: '修改失敗',
          duration: 'short',
        })
      )
    }
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
    <BodyLayout>
      <Tooltip title={'課程名稱'}>
        <Typography variant="h4" sx={{ alignSelf: 'center' }} fontWeight="bold">
          {course.title}
        </Typography>
      </Tooltip>

      {/* Chapter & Video Item */}
      {course.chapters.map((chapterData, index) => (
        <Box key={`chapterItem-${index}`}>
          <Box
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Typography sx={{ fontSize: 25 }} fontWeight="bold">
              {chapterData.title}
            </Typography>
            <Box display={'flex'} flexDirection={'row'}>
              <IconButton
                color="primary"
                onClick={() => {
                  setChapterIdSelector(chapterData.id)
                  setChapterTitle(chapterData.title)
                  handleChapterDialogOpen(true)
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="primary"
                onClick={() => handleDeleteChapter(chapterData.id)}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          {chapterData.videos.map((videoData, index) => (
            <Box
              key={`videoItem-${index}`}
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              ml={2}
            >
              <Link
                href={`/courses/edit/question/${videoData.id}`}
                passHref
                legacyBehavior
              >
                <Typography component={'a'} fontSize={20}>
                  {videoData.title}
                </Typography>
              </Link>
              <Box display={'flex'} flexDirection={'row'}>
                <IconButton
                  color="primary"
                  onClick={() => {
                    setChapterIdSelector(chapterData.id)
                    setVideoIdSelector(videoData.id)
                    setVideoTitle(videoData.title)
                    setVideoURL(videoData.url)
                    handleVideoDialogOpen(true)
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleDeleteVideo(chapterData.id, videoData.id)
                  }
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      ))}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignSelf: 'center',
          justifySelf: 'center',
          width: '400px',
          mt: 16,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Button
            fullWidth
            onClick={() => {
              setChapterTitle('新的章節')
              handleChapterDialogOpen()
            }}
            variant="contained"
            size="medium"
            startIcon={<AddCircleOutlineIcon />}
          >
            新增章節
          </Button>

          <Button
            fullWidth
            onClick={() => {
              setVideoTitle('新的影片')
              handleVideoDialogOpen()
            }}
            variant="contained"
            size="medium"
            sx={{ ml: 2 }}
            startIcon={<AddCircleOutlineIcon />}
          >
            新增影片
          </Button>
        </Box>
        <Button
          fullWidth
          sx={{ marginTop: '48px', backgroundColor: '#da3633' }}
          onClick={() => {
            handleDeleteCourse()
          }}
          variant="contained"
        >
          刪除
        </Button>
      </Box>

      {/* 新增/修改 章節 Dialog */}
      <Dialog open={openChapterDialog} onClose={handleChapterDialogClose}>
        <DialogTitle bgcolor={'#c4eafd'} fontWeight="bold">
          {chapterEdit ? '修改' : '新增' + '章節'}
        </DialogTitle>
        <Box padding={3}>
          <TextField
            required
            value={chapterTitle}
            sx={{ mt: 1 }}
            autoFocus
            label="名稱"
            fullWidth
            variant="standard"
            onChange={(event) => setChapterTitle(event.target.value)}
          ></TextField>
          <Button
            fullWidth
            onClick={() =>
              chapterEdit
                ? handleEditChapter(chapterTitle)
                : handleAddChapter(chapterTitle)
            }
            variant="contained"
            sx={{ mt: 6 }}
          >
            {chapterEdit ? '修改' : '新增'}
          </Button>
        </Box>
      </Dialog>

      {/* 新增/修改 影片 Dialog */}
      <Dialog open={openVideoDialog} onClose={handleVideoDialogClose}>
        <DialogTitle bgcolor={'#c4eafd'} fontWeight="bold">
          {videoEdit ? '修改' : '新增' + '影片'}
        </DialogTitle>

        <Box
          display={'flex'}
          flexDirection={'column'}
          width={'400px'}
          padding={3}
        >
          <TextField
            required
            value={videoTitle}
            sx={{ mt: '8px' }}
            autoFocus
            label="名稱"
            fullWidth
            variant="outlined"
            onChange={(event) => setVideoTitle(event.target.value)}
          ></TextField>

          {videoEdit ? null : (
            <>
              <FormControl sx={{ mt: '16px' }}>
                <InputLabel id="select-chapter">章節</InputLabel>
                <Select
                  required
                  label="章節"
                  labelId="select-chapter"
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
            </>
          )}
          <TextField
            sx={{ mt: '16px' }}
            required
            value={videoURL}
            label="影片連結"
            onChange={(event) => setVideoURL(event.target.value)}
          ></TextField>

          <Button
            onClick={() => {
              videoEdit
                ? handleEditVideo(videoTitle, videoURL)
                : handleAddVideo(chapterIdSelector, {
                    title: videoTitle,
                    url: videoURL,
                    description: '',
                    material: '',
                    chapterId: chapterIdSelector,
                  })
            }}
            variant="contained"
            sx={{ mt: '16px' }}
          >
            {videoEdit ? '修改' : '新增'}
          </Button>
        </Box>
      </Dialog>
    </BodyLayout>
  )
}
