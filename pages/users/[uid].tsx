import { GetServerSidePropsContext } from 'next'

function UserIdPage(props: any) {
  return <h1>{props?.userId}</h1>
}

export default UserIdPage

export async function getServerSideProps(content: GetServerSidePropsContext) {
  const { params, req, res } = content

  return {
    props: {
      userId: params?.uid,
    },
  }
}
