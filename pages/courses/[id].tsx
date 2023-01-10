import { useRouter } from 'next/router'
import { CourseDataType, getCourseById } from '../../lib/dummy-data'

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

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: 'e1' } }, { params: { id: 'e2' } }, { params: { id: 'e3' } }, { params: { id: 'e4' } }],
    fallback: true,
    //true(找無pre-render時，render, 此時還沒有資料, 需要有fallback) false blocking
  }
}

export async function getStaticProps(content: any) {
  console.log(content.params)

  return {
    props: {
      items: '',
    },
  }
}

export default CourseInnerPage
