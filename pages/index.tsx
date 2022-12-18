// import Link from 'next/link'
// import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material'

import { getAllCourses, getFeatredCourses } from '../dummy-data'
import CourseList from '../components/courses/course-list'

function HomePage() {
  const featuredCourses = getFeatredCourses()

  return (
    <>
      <ul>
        <CourseList items={featuredCourses} />
      </ul>
    </>
  )
}
export default HomePage
