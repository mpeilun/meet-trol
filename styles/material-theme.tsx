import { createTheme } from '@mui/material/styles'
import { Open_Sans } from '@next/font/google'

export const themeFont = Open_Sans({ subsets: ['latin'] })
const theme = createTheme({
  typography: {
    fontFamily: themeFont.style.fontFamily,
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#1fa8b3',
    },
    secondary: {
      main: '#11313e',
    },
    text: {
      primary: '#FFFFFF',
    },
    custom_bottom: {
      main: '#1fa8b3',
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        color: 'custom_bottom',
      },
    },
  },
})
//custom theme type
export default theme
declare module '@mui/material/styles' {
  interface Palette {
    custom_bottom: Palette['primary']
  }

  interface PaletteOptions {
    custom_bottom: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    custom_bottom: true
  }
}

declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides {
    custom_bottom: true
  }
}
