import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getProviders, signIn, useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { useEffect } from 'react'
import { CircularProgress, Box } from '@mui/material'

function SignInPage({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      signIn(providers.google.id)
    } else {
      window.close()
    }
  }, [session])

  return (
    <>
      <CircularProgress />
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders()

  return {
    props: { providers: providers },
  }
}

export default SignInPage
