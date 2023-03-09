import { createTheme } from '@mui/material/styles'
import { Noto_Sans_TC, Open_Sans } from '@next/font/google'
import { grey } from '@mui/material/colors'

export const themeFont = Open_Sans({ subsets: ['latin'] })
const theme = createTheme({
  typography: {
    fontFamily: themeFont.style.fontFamily,
  },
})

export default theme
