import { SliderProps, Typography } from '@mui/material'
import { Slider, SliderThumb, Box, styled } from '@mui/material'
import { ReactNode } from 'react'
import PlaceIcon from '@mui/icons-material/Place'

//custom component
const CustomSlider = styled(Slider)(({ theme }) => ({
  //TODO 把外框的顏色改成透明
  color: 'primary.main',
  backgroundColor: 'transparent',
  height: 3,
  padding: '0',
  '& .MuiSlider-thumb': {
    height: 30,
    width: 30,
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    // '&.second-thumb': {
    //   border: '2px dashed purple',
    // },
    '&:hover': {
      boxShadow: '0 0 0 0 rgba(58, 133, 137, 0.16)',
    },
    // '& .airbnb-bar': {
    //   height: 9,
    //   width: 1,
    //   marginLeft: 1,
    //   marginRight: 1,
    // },
    // '&.first-thumb .airbnb-bar': {
    //   backgroundColor: 'red',
    // },
    // '&.second-thumb .airbnb-bar': {
    //   backgroundColor: 'currentColor',
    // },
  },
  '& .MuiSlider-track': {
    color: 'transparent',
    height: 10,
  },
  '& .MuiSlider-rail': {
    color: 'transparent',
    opacity: theme.palette.mode === 'dark' ? undefined : 1,
    height: 10,
  },
}))

function CustomThumb(props: { children: ReactNode; other: any }) {
  const { children, ...other } = props
  return (
    <SliderThumb {...other}>
      {children}
      <PlaceIcon {...other} sx={{ width: '100%', height: '100%' }} />
    </SliderThumb>
  )
}

// function CustomValueLabel(props: { children: ReactNode; other: any }) {
//   const { children, ...other } = props
//   return <Box {...other}></Box>
// }

function CustomizedSlider(props: SliderProps) {
  return (
    <CustomSlider
      {...props}
      components={{
        Thumb: CustomThumb,
        // ValueLabel: CustomValueLabel,
      }}
    />
  )
}

export default CustomizedSlider
