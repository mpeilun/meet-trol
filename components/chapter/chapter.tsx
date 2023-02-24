import * as React from 'react'
import { styled } from '@mui/material/styles'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { Box, Icon, Divider } from '@mui/material'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.8rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(0),
  paddingBottom: theme.spacing(0),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState<string | false>('')

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(panel)
    }


    
  return (
    <div>
      <Accordion
        onChange={handleChange('panel1')}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Box sx={{ p: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>章節一</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box py={1.5} display="flex" justifyContent="space-between">
            <Typography variant="body2">TQC+ 101</Typography>
          </Box>
          <Divider />
          <Box py={1.6} display="flex" justifyContent="space-between">
            <Typography variant="body2">TQC+ 102</Typography>
          </Box>
          <Divider />
          <Box py={1.5} display="flex" justifyContent="space-between">
            <Typography variant="body2">TQC+ 103</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Box sx={{ p: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>章節二</Typography>
          </Box>{' '}
        </AccordionSummary>
        <AccordionDetails>
          <Typography>test</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Box sx={{ p: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>章節三</Typography>
          </Box>{' '}
        </AccordionSummary>
        <AccordionDetails>
          <Typography>test</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
