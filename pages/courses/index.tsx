import { useRouter } from 'next/router'

import CourseList from '../../components/courses/course-list'
import { getAllCourses } from '../../dummy-data'

function CoursePage() {
  const router = useRouter()
  const AllCourses = getAllCourses()

  return <CourseList items={AllCourses} />
}

export default CoursePage
