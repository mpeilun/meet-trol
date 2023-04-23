import React from 'react'

const Download = () => {
  
  React.useEffect(() => {
    const getData = async () => {
      const response = await fetch(`http://localhost:3000/api/record/log/getAnalysis?courseId=6433dbbe63a37fb092f46f4b&videoId=6433dcea63a37fb092f46f50`)
      const data = await response.json()
      downloadJSON(data)
      console.log(data)
    }
    getData()
  }, [])

  const downloadJSON = (list) => {
    const data = JSON.stringify(list)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'data.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  return <p>download</p>
}
export default Download
