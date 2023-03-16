import { Box } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import React, { useEffect, useRef, useState } from 'react'
import { DragData } from '../../../types/chapter'
import useDragger from './useDragger'

const DragButton = (props:{id:number}) => {
  
    const id = `button${props.id}`
    useDragger(id)

    return (
    <Box
      id={id}
      //   ref={buttonRef}
      sx={{
        // bottom: '2.5%',
        // right: `{${2.5 + (5*props.id)}%`,
        // position: 'absolute',
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        // width: 35,
        // height: 35,
        // borderRadius: '50%',
        // bgcolor: correctColor,
      }}
    >
      <AddCircleOutlineIcon
        sx={{ color: 'white', width: 30, height: 30 }}
      ></AddCircleOutlineIcon>
    </Box>
  )
}
export default DragButton
