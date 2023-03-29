import {
  CardActionArea,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from '@mui/material'
import { User } from '@prisma/client'

const CourseCard = (props: {
  id: string
  title: string
  description: string
  start: Date
  end: Date
  owner: User[]
  isManage: boolean
}) => {
  
  return (
    <CardActionArea
      sx={{
        '&:hover': {
          transform: 'scale(1.05)',
          transition: 'all 0.2s ease-in-out',
          borderRadius: '16px',
        },
      }}
      component="a"
      href={props.isManage ? `/manage/${props.id}` : `/courses/${props.id}`}
    >
      <Card sx={{ position: 'relative', borderRadius: '16px' }}>
        <CardMedia
          component="img"
          height="140"
          image={'/images/image-2.jpg'}
          alt={'courseImage'}
        />
        <CardContent>
          <Typography variant="h6" component="div">
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
          <Typography variant="body2">{`open: ${props.start} - ${props.end}`}</Typography>
          <Typography variant="body2">{`Teacher: ${props.owner?.map(
            (owner) => owner.name
          )}`}</Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  )
}
export default CourseCard
