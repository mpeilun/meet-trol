import { Box, Avatar, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
import { grey } from '@mui/material/colors'

export interface AboutCardDetail {
  name: string
  company: string
  title: string
  photo: string
}

const avatarSx = {
  my: 2,
  width: '100%',
  height: '100%',
  maxWidth: 200,
}

function About(props: { cardDetails: AboutCardDetail[] }) {
  return (
    <Box sx={{ p: { md: '2rem 4rem ', xs: '2rem' } }}>
      <Typography variant="h4" component="h2" sx={{ textAlign: 'center' }}>
        開發團隊
      </Typography>
      <Box display="flex" justifyContent="center">
        <AboutGrid cardDetails={props.cardDetails} />
      </Box>
    </Box>
  )
}

function AboutGrid(props: { cardDetails: AboutCardDetail[] }) {
  return (
    <Grid
      container
      rowSpacing={5}
      spacing={4}
      m={1}
      width="100%"
      maxWidth={1200}
    >
      {props.cardDetails.map((item, index) => {
        return (
          <Grid xs={12} md={3} key={`organizer-grid-${index}`}>
            <Box display="flex" justifyContent="center">
              <Avatar sx={avatarSx}>
                <img
                  src={item.photo}
                  alt={item.title}
                  width={200}
                  height={200}
                />
              </Avatar>
            </Box>
            <Typography variant="h6" fontWeight={700} textAlign="center">
              {item.name}
            </Typography>
            <Typography variant="subtitle1" textAlign="center">
              {item.company}
            </Typography>
            <Typography variant="subtitle2" textAlign="center">
              {item.title}
            </Typography>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default About
