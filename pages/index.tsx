// import Link from 'next/link'
// import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material'
import { CourseDataType, getAllCourses } from '../dummy-data'
import CourseList from '../components/courses/course-list'

function HomePage(props: { items: string }) {
  return <p>{props.items}</p>
}

export async function getStaticProps() {
  const time = new Date()

  return {
    props: {
      items: `${time.getMinutes()}:${time.getSeconds()}`,
    },
    revalidate: 1,
  }
}

export default HomePage
