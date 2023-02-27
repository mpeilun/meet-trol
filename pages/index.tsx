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
      <Box height="100%" display="flex" sx={{ bgcolor: '#9ac5cf', justifyContent: 'center' }}>
        <Image fill style={{ display: 'block', margin: 'auto auto', objectFit: 'contain', maxWidth: 400 }} alt={'Meet-Trol LOGO'} src={'/images/logo.png'} />
      </Box>
    </>
  )
}

export default HomePage
