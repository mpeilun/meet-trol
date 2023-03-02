import { useEffect, useState } from 'react'
import { signOut, signIn, useSession } from 'next-auth/react'
import { Box, Button, Typography, Avatar } from '@mui/material'
import Image from 'next/image'

//TODO 不要使用 NewWindow?
function AuthPage() {
  const [popup, setPopUp] = useState(false)
  const { data: session } = useSession()

  return (
    <>
      <Box display="flex" justifyContent="center">
        {session ? (
          <Box
            display="flex"
            sx={{ flexDirection: 'column', justifyContent: 'center' }}
          >
            <Avatar
              sx={{ width: 100, height: 100, m: '24px auto' }}
              src={session.user.image}
              alt="ProfilePhoto"
            >
              <Image
                src={session.user.image}
                alt="ProfilePhoto"
                width={400}
                height={400}
              ></Image>
            </Avatar>
            <Typography>Name: {session.user.name}</Typography>
            <Typography>Email: {session.user.email}</Typography>
            <Button variant="outlined" sx={{ m: 2 }} onClick={() => signOut()}>
              登出
            </Button>
          </Box>
        ) : (
          <>
            <Button
              variant="outlined"
              sx={{ m: 2 }}
              onClick={() => {
                window.open('/auth/signin', 'Sign In', 'width=600,height=600')
              }}
            >
              登入
            </Button>
          </>
        )}
      </Box>
    </>
  )
}

export default AuthPage
