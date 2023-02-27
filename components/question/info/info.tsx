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
        {/* 顯示圖片 */}
        <Box sx={{ width: '600px' }}>
          <Box
            component="img"
            src="https://1.bp.blogspot.com/-FKx0CXFgCh0/W5Ik7C3Y1zI/AAAAAAAAAcw/VFW-nQzEdckeEKpdFkeIyCioNMr7SoDgACLcBGAs/s640/java8_android.png" // 變數替換 是否有圖片有則是網址
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
