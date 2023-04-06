import { Paper } from '@mui/material'

function BodyLayout(props: { children: React.ReactNode; other?: any }) {
  const { children, ...other } = props
  return (
    <Paper
      {...other}
      key={'body-paper'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: { md: '80%', xs: ' 100%' },
        maxWidth: 'xl',
        m: { md: '32px auto', xs: '0' },
        p: 3,
        backgroundColor: '#d7f1fd',
      }}
    >
      {children}
    </Paper>
  )
}

export default BodyLayout
