import Image from 'next/image'
import Link from 'next/link'

import { CourseDataType } from '../../dummy-data'

function CourseItem(props: { course: CourseDataType }) {
  const { course } = props
  const humanReeadableDate = new Date(course.data).toLocaleDateString('zh-TW', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const exploeeLink = `/event/${course.id}`

  return (
    <li>
      <Image src={course.image} alt={course.title} width="200" height="200" />
      <div>
        <div>
          <h2>{course.title}</h2>
        </div>
        <div>{humanReeadableDate}</div>
        <div>
          <Link href="/">Explore Course</Link>
        </div>
      </div>
    </li>
  )
}

export default CourseItem
