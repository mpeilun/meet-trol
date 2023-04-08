import { Box, Paper } from '@mui/material'

function BodyLayout(props: { children: React.ReactNode; other?: any }) {
  const { children, ...other } = props
  return (
    <Box
      {...other}
      key={'body-paper'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: { md: '80%', xs: ' 100%' },
        maxWidth: 'xl',
        m: { md: '32px auto', xs: '0' },
        p: 3,
        // backgroundColor: '#11313e',
      }}
    >
      {children}
    </Box>
  )
}

export default BodyLayout
