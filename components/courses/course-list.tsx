import CourseItem from './course-item'
import { CourseDataType } from '../../dummy-data'

function CourseList(props: { items: Array<CourseDataType> }) {
  return (
    <ul>
      {props.items.map((course) => (
        <CourseItem key={course.id} course={course}></CourseItem>
      ))}
    </ul>
  )
}

export default CourseList
