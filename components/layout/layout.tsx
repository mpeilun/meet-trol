import { Fragment, ReactNode } from 'react'
import MainHeader from './main-header'

function Layout(props: { children: ReactNode }) {
  return (
    <Fragment>
      <MainHeader />
      <main style={{height:'calc(100vh - 64px)'}}>{props.children}</main>
    </Fragment>
  )
}

export default Layout
