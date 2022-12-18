import { useRouter } from 'next/router'

import { CourseDataType, getCourseById } from '../../dummy-data'

function CourseInnerPage() {
  const router = useRouter()
  const courseId = router.query.id

  let course: CourseDataType | undefined
  if (typeof courseId === 'string') {
    course = getCourseById(courseId)
  }
  if (!course) {
    return <p>Not Course Found!</p>
  }

  return (
    <ul>
      <li>{course.id}</li>
      <li>{course.description}</li>
      <li>{course.image}</li>
    </ul>
  )
}

export default CourseInnerPage
