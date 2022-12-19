// import Link from 'next/link'
// import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material'
import { CourseDataType, getAllCourses } from '../dummy-data'
import CourseList from '../components/courses/course-list'

function HomePage(props: { items: string }) {
  return <p>{props.items}</p>
}

// import path from 'path'
// import fs from 'fs/promises'

export async function getStaticProps() {
  // const filePath = path.join(process.cwd(), 'data/dummy.json')
  // const jsonData = await fs.readFile(filePath)
  // const data = JSON.parse(jsonData.toString())

  const time = new Date()

  return {
    props: {
      items: `${time.getMinutes()}:${time.getSeconds()}`,
    },
    revalidate: 1,
    // notFound: true,
  }
}

export default HomePage
