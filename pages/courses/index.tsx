import { useRouter } from 'next/router'

function CoursePage() {
  const router = useRouter()
  router.query.courseId

  return (
    <>
      <h1>The empty page</h1>
    </>
  )
}

export default CoursePage
