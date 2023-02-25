import { useSession } from 'next-auth/react'

function AccountPage() {
  const { data: session } = useSession()
  return <></>
}

export default AccountPage
