import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document'
import { resetServerContext } from "react-beautiful-dnd"
import React from 'react'

// export default function Document() {
//   resetServerContext()
//   return (
//     <Html lang="en">
//       <Head />
//       <body>
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// }

type Props = {}

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx:DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)
    resetServerContext()
    return { ...initialProps}
  }

  render() {
    return (
          <Html lang="en">
            <Head />
            <body>
              <Main />
              <NextScript />
            </body>
          </Html>
        )
  }
}

export default MyDocument