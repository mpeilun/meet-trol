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
  handleQuestionClose: () => void
  data: InfoData | ChoiceData | RankData | FillData | DragData
}) => {
  return (
    <>
      <Box minHeight={50} display="flex" alignItems="center">
        <Typography variant="h5" sx={{ width: '100%' }}>
          注意！
        </Typography>
        <IconButton onClick={() => props.handleQuestionClose()}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ pt: 1 }}>
        <Typography variant="h6">{props.data.title}</Typography>
        <Typography>
          {'content' in props.data ? props.data.content ?? '' : ''}
        </Typography>
        {/* 顯示圖片 */}
        <Box sx={{ width: '600px' }}>
          <Box
            component="img"
            src={'url' in props.data ? props.data.url ?? 'NOIMAGE' : 'NOIMAGE'} // 變數替換 是否有圖片有則是網址
            alt="Failt to load"
            sx={{ borderRadius: 2, mt: 1, width: '100%' }}
          ></Box>
        </Box>
      </Box>
    </>
    //   </Card>
    // </Box>
  )
}

export default Info
