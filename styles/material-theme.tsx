import { createTheme } from '@mui/material/styles'
import { Open_Sans } from '@next/font/google'

export const themeFont = Open_Sans({ subsets: ['latin'] })
const theme = createTheme({
  typography: {
    fontFamily: themeFont.style.fontFamily,
  },
  palette: {
    // mode: 'dark',
    primary: {
      main: '#645CBB',
    },
    secondary: {
      main: '#575e71',
    },
    // text: {
    //   primary: '#FFFFFF',
    // },
    // custom: {
    //   main: '#1fa8b3',
    // },
  },
})
//custom theme type
export default theme
// declare module '@mui/material/styles' {
//   interface Palette {
//     custom: Palette['primary']
//   }

//   interface PaletteOptions {
//     custom: PaletteOptions['primary']
//   }
// }

// declare module '@mui/material/Button' {
//   interface ButtonPropsColorOverrides {
//     custom: true
//   }
// }

// declare module '@mui/material/TextField' {
//   interface TextFieldPropsColorOverrides {
//     custom: true
//   }
// }
