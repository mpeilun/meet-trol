import { createMuiTheme, SliderProps, Typography } from '@mui/material'
import { Slider, SliderThumb, Box, styled } from '@mui/material'
import { ReactNode } from 'react'
import PlaceIcon from '@mui/icons-material/Place'
import { ClassNames } from '@emotion/react'

//custom component
const CustomSlider = styled(Slider)(({ theme }) => ({
  //https://mui.com/material-ui/guides/styled-engine/
  //go for emotion
  //TODO 把外框的顏色改成透明
  // color: 'transparent',
  // height: 3,
  // padding: '0',
  // boxShadow: 'none',
  '& .MuiCircularProgress-circle': {
    display: 'none',
    boxShadow: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 30,
    width: 30,
    color: 'red',
    // border: 'none',
    boxShadow: '0px 0px 0px 0px rgba(255, 255, 25, 0.16)',
    borderRadius: '5%',
    display: 'none',
    // '&.second-thumb': {
    //   border: '2px dashed purple',
    // },
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
    '&:before': {
      boxShadow: 'none',
    },
    '& .custom-slider-thumb': {
      display: 'none',
      boxShadow: 'none',
    },
  },
  '& .MuiSlider-track': {
    display: 'none',
    height: 10,
  },
  '& .MuiSlider-rail': {
    display: 'none',
    height: 10,
  },
  // '.custom-slider-thumb': {
  //   backgroundColor: '#eeeeee',
  //   shadow: '0',
  //   radius: '0',
  // },
}))

function CustomThumb(props: { children: ReactNode; other: any }) {
  const { children, ...other } = props
  return (
    <SliderThumb {...other} className={'custom-slider-thumb'}>
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
