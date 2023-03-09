import { SliderProps, SliderValueLabelProps, Typography } from '@mui/material'
import { Slider, SliderThumb, SliderValueLabel } from '@mui/material'
import { ReactElement, ReactNode } from 'react'
import PlaceIcon from '@mui/icons-material/Place'
import styled from '@emotion/styled'

//custom component
const CustomSlider = styled(Slider)(({ theme }) => ({
  padding: '0',
  margin: '0',
  position: 'relative',
  height: '24px',
  top: '5px',
  '& .MuiSlider-track': {
    display: 'none',
    height: '100%',
  },
  '& .MuiSlider-rail': {
    display: 'none',
    height: '100%',
  },
  '& .MuiSlider-thumb': {
    position: 'absolute',
    top: '12px',
    width: '30px',
    height: '30px',
    color: 'primary.main',
    backgroundColor: 'transparent',
    boxShadow: 'none !important',
    '&::before': {
      boxShadow: 'none !important',
    },
  },
  '& .MuiSlider-valueLabel': {
    width: '72px',
    height: '100%',
    position: 'absolute',
    //這個值要隨時調整
    top: '80px',
    backgroundColor: '#1976d2',
    borderRadius: '5px',
    '&::before': {
      content: '""',
      width: 0,
      height: 0,
      position: 'absolute',
      top: '-10px',
      left: '26px',
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: '0 10px 16px 10px',
      // Bug, #1976d2 is primary.main color, below can use theme.palette.primary.main
      borderColor: `transparent transparent #1976d2 transparent`,
      transform: 'rotate(0deg)',
    },
  },
}))

function CustomThumb(props: { children: ReactNode; other: any }) {
  const { children, ...other } = props
  return (
    <SliderThumb {...other}>
      {children}
      <PlaceIcon sx={{ width: '100%', height: '100%' }} />
    </SliderThumb>
  )
}

function CustomValueLabel(props: SliderValueLabelProps) {
  const { children, ...other } = props
  return <SliderValueLabel {...other}>{children}</SliderValueLabel>
}

function CustomizedSlider(props: SliderProps) {
  return (
    <CustomSlider
      {...props}
      components={{
        Thumb: CustomThumb,
        ValueLabel: CustomValueLabel,
      }}
    />
  )
}

export default CustomizedSlider
