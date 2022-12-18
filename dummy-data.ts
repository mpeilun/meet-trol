export interface CourseDataType {
  id: string
  title: string
  description: string
  data: string
  image: string
  isFeatured: boolean
}

const courseData: Array<CourseDataType> = [
  { id: 'e1', title: 'Android 9', description: 'Course for android tqc+ certificate', data: '2022/12/21', image: '/images/image-1.jpg', isFeatured: true },
  { id: 'e2', title: 'Python', description: 'Course for Starting Python', data: '2021/12/18', image: '/images/image-2.jpg', isFeatured: true },
  { id: 'e3', title: 'Python', description: 'Course for Starting Python', data: '2021/12/18', image: '/images/image-2.jpg', isFeatured: true },
  { id: 'e4', title: 'Python', description: 'Course for Starting Python', data: '2021/12/18', image: '/images/image-2.jpg', isFeatured: false },
]

function getFeatredCourses() {
  return courseData.filter((course) => course.isFeatured)
}

function getAllCourses() {
  return courseData
}

function getCourseById(id: string) {
  return courseData.find((course) => course.id === id)
}

export { courseData, getFeatredCourses, getAllCourses, getCourseById }
