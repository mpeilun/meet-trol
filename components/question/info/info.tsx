import { Box, Divider, IconButton, Typography } from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

// 還需引入 description 圖片 src 變數
const Info = (props: { handleQuestionClose: () => void }) => {
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
        <Typography>Alert Dialog 記得加上「.show」</Typography>
        <Box sx={{ width: '600px' }}>
          <Box
            component="img"
            src="/images/info.PNG"
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
