import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import theme from '../../styles/material-theme'
import { useTheme } from '@mui/material'

function ViewChart(props: { data: any[] }) {
  const { data } = props

  const theme = useTheme()
  const primaryColor = theme.palette.primary.main

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        // width={200}
        // height={100}
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <Area
          type="monotone"
          dataKey="viewer"
          stroke={primaryColor}
          fill={primaryColor}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default ViewChart
