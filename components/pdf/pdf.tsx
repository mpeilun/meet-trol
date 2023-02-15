import * as React from 'react'
import { useRouter } from 'next/router'
import { pdfjs, Document, Page } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { Box, Button, Typography } from '@mui/material'
import { KeyboardArrowLeft, KeyboardArrowRight, ZoomIn, ZoomOut } from '@mui/icons-material'

const pdfControllerButtonSx = {
  width: 50,
  height: 50
}

interface PageSize {
  width: number,
  height: number,
}
function PDF(props: { path: string }) {
  const path = '/assets/test.pdf'
  //PDF  
  const [numPages, setNumPages] = React.useState(null)//PDF的總頁數
  const [page, setPage] = React.useState(1)//當前PDF頁面編號
  const [pageHeight, setPageHeight] = React.useState(100) //取得PDF當頁的高度
  const [hoverPDF, setHoverPDF] = React.useState(false) //滑鼠是否懸浮在PDF上
  const [scale, setScale] = React.useState(1)

  //文件載入成功
  const onDocumentLoadSuccess = ({ numPages }: { numPages: any }) => {
    setNumPages(numPages)
    console.log("我執行了")
  }
  const onRenderSuccess = (page: any) => {
    setPageHeight(page.height + 100);
    console.log('hello')
  };
  return (
    <Box className='pdf-controller-div'
      sx={{
        position: 'relative',
        height: pageHeight
      }} onMouseEnter={() => setHoverPDF(true)} onMouseLeave={() => setHoverPDF(false)}>
      <Document file={path} onLoadSuccess={onDocumentLoadSuccess}>
        <Page key={`page_${page + 1}`}
          pageNumber={page}
          renderAnnotationLayer={true}
          renderTextLayer={true}
          onRenderSuccess={onRenderSuccess}
          scale={scale}
        />
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
        <Button sx={pdfControllerButtonSx} onClick={() => setScale(scale-0.2)} disabled={scale == 0.6}><ZoomOut/></Button>
        <Button sx={pdfControllerButtonSx} onClick={() => setPage(page - 1)} disabled={page == 1}><KeyboardArrowLeft /></Button>
        <Typography color='black'>{page} / {numPages}</Typography>
        <Button sx={pdfControllerButtonSx} onClick={() => setPage(page + 1)} disabled={page == numPages}><KeyboardArrowRight /></Button>
        <Button sx={pdfControllerButtonSx} onClick={() => setScale(scale+0.2)} disabled={scale == 2}><ZoomIn/></Button>
      </Box>
    </Box>
  )
}

export default PDF