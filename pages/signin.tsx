import { getProviders, signIn, getSession, getCsrfToken } from 'next-auth/react'
import { InferGetServerSidePropsType } from 'next'
import { CtxOrReq } from 'next-auth/client/_utils'

function SignInPage({ providers, csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
          </div>
        )
      })}
    </>
  )
}

export const getServerSideProps = async (context: CtxOrReq | undefined) => {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)
  const { req } = context
  const session = await getSession({ req })

  if (session) {
    return {
      redirect: { destination: '/' },
    }
  }
  return {
    props: {
      providers,
      csrfToken,
    },
  }
}

export default SignInPage
