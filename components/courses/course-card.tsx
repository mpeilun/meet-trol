import {
  CardActionArea,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Tooltip,
} from '@mui/material'
import { User } from '@prisma/client'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

const CourseCard = (props: {
  id: string
  title: string
  description: string
  start: Date
  end: Date
  owner: User[]
  isManage: boolean
}) => {
  dayjs.extend(utc)

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
      href={
        props.isManage
          ? `/courses/edit/chapter/${props.id}`
          : `/courses/${props.id}`
      }
    >
      <Card
        sx={{ position: 'relative', borderRadius: '16px', minHeight: '275px' }}
      >
        <CardMedia
          component="img"
          height="140"
          image={'/images/image-2.png'}
          alt={'courseImage'}
        />
        <CardContent>
          <Typography noWrap variant="h6" component="div">
            {props.title}
          </Typography>
          <Tooltip title={props.description}>
            <Typography noWrap variant="body2" color="text.secondary">
              {props.description}
            </Typography>
          </Tooltip>
          <Tooltip
            title={`${dayjs.utc(props.start).format('YYYY/MM/DD')} - ${dayjs
              .utc(props.end)
              .format('YYYY/MM/DD')}`}
          >
            <Typography noWrap variant="body2">{`開放時間: ${dayjs
              .utc(props.start)
              .format('MM/DD')} - ${dayjs
              .utc(props.end)
              .format('MM/DD')}`}</Typography>
          </Tooltip>
          <Tooltip title={`${props.owner?.map((owner) => owner.name)}`}>
            <Typography noWrap variant="body2">{`主持人: ${props.owner?.map(
              (owner) => owner.name
            )}`}</Typography>
          </Tooltip>
        </CardContent>
      </Card>
    </CardActionArea>
  )
}
export default CourseCard
