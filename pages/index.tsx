// import Link from 'next/link'
// import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material'
// import { CourseDataType, getAllCourses } from '../lib/dummy-data'
import CourseList from '../components/courses/course-list'
import { useContext } from 'react'
import Image from 'next/image'
import { Box } from '@mui/material'

function HomePage() {
  return (
    <>
      <Box width={'100%'} height={'100%'} sx={{ bgcolor: '#9ac5cf' }}>
        <Image fill style={{ display: 'block', margin: 'auto auto', objectFit: 'contain' }} alt={'Meet-Trol LOGO'} src={'/images/logo.png'} />
      </Box>
    </>
  )
}

export default HomePage
