import { useRouter } from 'next/router'

function CourseInnerPage() {
  const router = useRouter()

  return (
    <>
      <p>{router.asPath}</p>
    </>
  )
}

export default CourseInnerPage
