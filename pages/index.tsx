// import Link from 'next/link'
// import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material'
import { CourseDataType, getAllCourses } from '../lib/dummy-data'
import CourseList from '../components/courses/course-list'
import { useContext } from 'react'

function HomePage(props: { items: string }) {
  return (
    <>
      <p>{props.items}</p>
    </>
  )
}

export async function getStaticProps() {
  const time = new Date()

  return {
    props: {
      items: `Now time ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
    },
    revalidate: 1,
  }
}

export default HomePage
