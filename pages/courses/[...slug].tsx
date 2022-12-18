import { useRouter } from 'next/router'
import CircularProgress from '@mui/material/CircularProgress'

import { CourseDataType, getFilterdEvents, getAllCourses } from '../../dummy-data'
import CourseList from '../../components/courses/course-list'

function FilterdCoursesPage() {
  const router = useRouter()
  const filterData = router.query.slug
  let courses: Array<CourseDataType> | undefined | null = null

  if (!filterData) {
    return <CircularProgress />
  }

  if (!isNaN(Number(filterData[1])) && !isNaN(Number(filterData[2])) && !isNaN(Number(filterData[3]))) {
    console.log(filterData)
    courses = getFilterdEvents(new Date(`${filterData[1]}/${filterData[2]}/${filterData[3]}`))
  } else {
    return <p>Wrong input format</p>
  }

  return courses.length == 0 ? <p>Not found</p> : <CourseList items={courses} />
}

export default FilterdCoursesPage
