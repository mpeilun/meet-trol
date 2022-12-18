import { Fragment, ReactNode } from 'react'
import MainHeader from './main-header'

function Layout(props: { children: ReactNode }) {
  return (
    <Fragment>
      <MainHeader />
      <main>{props.children}</main>
    </Fragment>
  )
}

export default Layout
