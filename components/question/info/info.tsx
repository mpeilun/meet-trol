import { Box, Divider, IconButton, Typography } from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import {
  ChoiceData,
  RankData,
  FillData,
  DragData,
} from '../../../types/chapter'
import { Info as InfoData } from '@prisma/client'

// 還需引入 description 圖片 src 變數
const Info = (props: {
  close: () => void
  handleQuestionClose: () => void
  data: InfoData
}) => {
  const data = props.data
  const isNoImage = data.url == ''
  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  return (
    <>
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h4" sx={{ fontWeight: 'bold', width: '100%' }}>
          {data.title ?? '資訊卡'}
        </Typography>
        <IconButton
          onClick={async () => {
            props.close()
            // await delay(200)
            props.handleQuestionClose()
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ pt: 1, minHeight: 150 }}>
        {data.content && (
          <Typography variant="body1" sx={{ letterSpacing: 2, fontSize: 24 }}>
            {data.content ?? ''}
          </Typography>
        )}
        {/* 顯示圖片 */}
        <Box sx={{ width: '600px', mt: 1 }}>
          {!isNoImage && (
            <Box
              component="img"
              src={props.data.url} // 變數替換 是否有圖片有則是網址
              alt="Failt to load image"
              sx={{ borderRadius: 2, width: '100%' }}
            ></Box>
          )}
        </Box>
      </Box>
    </>
    //   </Card>
    // </Box>
  )
}

export default Info
