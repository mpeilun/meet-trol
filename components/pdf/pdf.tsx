import * as React from 'react'
import { useRouter } from 'next/router'
import { pdfjs, Document, Page } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { Box, Button, Typography } from '@mui/material'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'

function PDF() {
  const router = useRouter()
  const path = '/assets/test.pdf'
  //PDF
  const [page, setPage] = React.useState(1)
  const [numPages, setNumPages] = React.useState(null)
  const [hoverPDF, setHoverPDF] = React.useState(false)

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
    // <Box width='500px' height='300px' sx={{backgroundColor: 'green'}} position='relative'>
    //     <Box position='absolute' left={'50%'} bottom='5%' bgcolor='blue' mx={'auto'} sx={{transform: 'translateX(-50%)'}} display='flex' alignItems='center'>
    //         <ButtonBase sx={{width: 50, height: 50}}><KeyboardArrowLeft/></ButtonBase>
    //         <Typography>第1頁</Typography>
    //         <ButtonBase sx={{width: 50, height: 50}}><KeyboardArrowRight/></ButtonBase>
    //     </Box>
    // </Box>
    <div className='pdf-controller-div'
      style={{ position: 'relative' }} onMouseEnter={() => setHoverPDF(true)} onMouseLeave={() => setHoverPDF(false)}>
      <Document file={path} onLoadSuccess={onDocumentLoadSuccess}>
        {/* {Array.from({ length: numPages! }, (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderAnnotationLayer={true}
                renderTextLayer={true}
              />
            ))} */}
        <Page key={`page_${page + 1}`} pageNumber={page} renderAnnotationLayer={true} renderTextLayer={true} />
      </Document>
      <Box
        className='pdf-controller-box'
        position='absolute'
        left={'50%'}
        bottom='5%'
        bgcolor='white'
        // mx={'auto'}
        display='flex'
        alignItems='center'
        sx={{
          transform: 'translateX(-50%)',
          transition: 'opacity ease-in-out 0.2s',
          opacity: hoverPDF ? 100 : 0,
        }}>
        <Button sx={{ width: 50, height: 50 }} onClick={() => setPage(page - 1)} disabled={page == 1}><KeyboardArrowLeft /></Button>
        <Typography color='black'>第{page}頁</Typography>
        <Button sx={{ width: 50, height: 50 }} onClick={() => setPage(page + 1)} disabled={page == numPages}><KeyboardArrowRight /></Button>
      </Box>
    </div>
  )
}

export default PDF