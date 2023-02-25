import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Typography, Paper, Box } from '@mui/material'

interface Profile {
  name: string
  email: string
  courses: [
    {
      title: string
      updatedAt: Date
    }
  ]
}

function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchDate = async () => {
      const data = await fetch('/api/account/profile')
      setProfile(await data.json())
    }
    fetchDate().catch(console.error)
  }, [profile])

  if (!session) {
    return (
      <>
        <Typography variant="h6" textAlign="center" sx={{ p: 2 }}>
          請登入後再嘗試操作！
        </Typography>
      </>
    )
  }

  return (
    <>
      {profile ? (
        <>
          <Paper sx={{ width: '400px', height: '400px', margin: '100px auto' }}>
            <Box sx={{ p: 5 }}>
              <Typography>名稱: {profile.name} </Typography>
              <Typography>Email: {profile.email} </Typography>
              <Typography>課程清單:</Typography>
              <ul>
                {profile.courses?.map((course) => (
                  <li key={`${course.title}_${course.updatedAt}`}>
                    <Typography>{course.title}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          </Paper>
        </>
      ) : null}
    </>
  )
}

export default AccountPage
