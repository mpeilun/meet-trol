import { Info } from '@prisma/client'
import { ChoiceData, RankData, FillData, DragData } from '../../types/chapter'
import QuestionType from '../popup/questionType'
import { CSSTransition } from 'react-transition-group'
import { useState } from 'react'
import Button from '@mui/material/Button'
import { Box, FormControl, InputLabel, MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'

const ReplyLog = (props: {
  questions: (Info | ChoiceData | RankData | FillData | DragData)[]
}) => {
  const [currentData, setCurrentData] = useState<number>(1)

  const [age, setAge] = useState<string>('')

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value)
  }
  return (
    <div style={{ height: '600px' }}>
      {props.questions.map((question, index) => {
        return (
          <Box key={`${index}Box`}>
            <CSSTransition
              key={`${index} question`}
              in={currentData === index}
              classNames="fade"
              unmountOnExit
            >
              <Box>
                {/* <FormControl
                  key={`${index}DropDownMenu`}
                  sx={{minWidth: 120 }}
                  size="small"
                >
                  <InputLabel id="demo-select-small">Age</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={age}
                    label="Age"
                    onChange={handleChange}
                  >
                    {question.feedback.map((feedback, index) =>{
                        <MenuItem value={10}>Ten</MenuItem>
                    })}
                  </Select>
                </FormControl> */}
                <QuestionType
                  key={`${index} question`}
                  setClose={() => {}}
                  data={question}
                  isLog={true}
                ></QuestionType>
              </Box>
            </CSSTransition>
          </Box>
        )
      })}
      <Box
        sx={{
          pt: 1.5,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Button
          disableElevation
          variant="contained"
          onClick={() => {
            setCurrentData(currentData - 1)
          }}
          sx={{
            width: 125,
            fontWeight: 'bold',
            borderRadius: 16,
          }}
        >
          上一題
        </Button>
        <Box></Box>

        <Button
          disableElevation
          variant="contained"
          onClick={() => {
            setCurrentData(currentData + 1)
          }}
          sx={{
            width: 125,
            fontWeight: 'bold',
            borderRadius: 16,
          }}
        >
          下一題
        </Button>
      </Box>
    </div>
  )
}

export default ReplyLog
// const DataSwitcher: React.FC = () => {
//   const [currentData, setCurrentData] = useState<'data1' | 'data2'>('data1')

//   const handleDataChange = () => {
//     setCurrentData(currentData === 'data1' ? 'data2' : 'data1')
//   }

//   const renderData = () => {
//     switch (currentData) {
//       case 'data1':
//         return <Data1 name="John" />
//       case 'data2':
//         return <Data2 name="Jane" />
//       default:
//         return null
//     }
//   }

//   return (
//     <div>
//       <CSSTransition
//         in={currentData === 'data1'}
//         timeout={300}
//         classNames="fade"
//         unmountOnExit
//       >
//         <Data1 name="John" />
//       </CSSTransition>
//       <CSSTransition
//         in={currentData === 'data2'}
//         timeout={300}
//         classNames="fade"
//         unmountOnExit
//       >
//         <Data2 name="Jane" />
//       </CSSTransition>
//       <button onClick={handleDataChange}>Switch Data</button>
//     </div>
//   )
// }
