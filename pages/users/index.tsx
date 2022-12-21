import { GetServerSidePropsContext } from 'next'

function UserProfilePage(props: any) {
  return <h1>{props?.userName}</h1>
}

export default UserProfilePage

export async function getServerSideProps(content: GetServerSidePropsContext) {
  const { params, req, res } = content

  return {
    props: {
      userName: 'peilun',
    },
  }
}
