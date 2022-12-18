import Image from 'next/image'
import Link from 'next/link'
import Button from '@mui/material/Button'
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'

import styles from './course-item.module.css'
import { CourseDataType } from '../../dummy-data'

function CourseItem(props: { course: CourseDataType }) {
  const { course } = props
  const humanReeadableDate = new Date(course.data).toLocaleDateString('zh-TW', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const exploeeLink = `/courses/${course.id}`

  return (
    <li className={styles.item}>
      <Image src={course.image} alt={course.title} width="100" height="100" />
      <div className={styles.content}>
        <div>
          <h2>{course.title}</h2>
        </div>
        <div>{humanReeadableDate}</div>
        <div>
          <Button href={exploeeLink} variant="outlined" LinkComponent={Link} size="small" sx={{ marginTop: 1 }}>
            <span>Explore Course</span>
            <ArrowRightAltOutlinedIcon className={styles.icon} />
          </Button>
        </div>
      </div>
    </li>
  )
}

export default CourseItem
