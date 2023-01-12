import * as React from 'react'
import { useRouter } from 'next/router'
import { pdfjs, Document, Page } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { Box, ButtonBase, Typography } from '@mui/material'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'

function PDF() {
  const router = useRouter()
  const path = '/assets/test.pdf'
  //PDF
  const [pageIndex, setPageIndex] = React.useState(0)
  const [numPages, setNumPages] = React.useState(null);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: any) {
    setNumPages(nextNumPages);
  }
  return (
    // <Document file={path} onLoadSuccess={onDocumentLoadSuccess}>
    //     {Array.from({ length: numPages! }, (_, index) => (
    //         <Page
    //           key={`page_${index + 1}`}
    //           pageNumber={index + 1}
    //           renderAnnotationLayer={true}
    //           renderTextLayer={true}
    //         />
    //       ))}
    // </Document>
    <Box width='500px' height='300px' sx={{backgroundColor: 'green'}} position='relative'>
        <Box position='absolute' left={'50%'} bottom='5%' bgcolor='blue' mx={'auto'} sx={{transform: 'translateX(-50%)'}} display='flex' alignItems='center'>
            <ButtonBase sx={{width: 50, height: 50}}><KeyboardArrowLeft/></ButtonBase>
            <Typography>第1頁</Typography>
            <ButtonBase sx={{width: 50, height: 50}}><KeyboardArrowRight/></ButtonBase>
        </Box>
    </Box>
  )
}

export default PDF