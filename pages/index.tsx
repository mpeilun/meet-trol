// import Link from 'next/link'
// import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material'
import { CourseDataType, getAllCourses } from '../dummy-data'
import CourseList from '../components/courses/course-list'
import { useContext } from 'react'
import NotificationContext from '../store/notification-context'

function HomePage(props: { items: string }) {
  const notificationCtx = useContext(NotificationContext)

  return (
    <>
      <p>{props.items}</p>
      <button
        style={{ width: '100px', height: '50px' }}
        onClick={() => {
          notificationCtx?.showNotificationHandler({ title: 'Info', message: 'hello!!!', status: 'info' })
        }}
      ></button>
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
