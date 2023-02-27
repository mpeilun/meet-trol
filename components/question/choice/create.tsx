import {
  Card,
  Box,
  Input,
  InputLabel,
  FormControl,
  Typography,
  Button,
  Checkbox,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'

const CreateChoice = () => {
  const [question, setQuestion] = React.useState({
    title: '',
    options: [''],
    checked: [false],
  })
  //取得題目
  // const { id } = useParams()
  const id = '636fc3b3226a145127e56cf7'
  //如果id不為undefined就向資料庫拿資料

  const [submitQuestion, setSubmitQuestion] = React.useState({
    title: '',
    options: [''],
    checked: [false],
  })
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion({ ...question, title: event.target.value })
  }
  const handleAnswerChange =
    (idx: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      question.options[idx] = event.target.value
      setQuestion({ ...question })
    }
  //處理checkbox
  const handleCheckedChange =
    (idx: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      question.checked[idx] = event.target.checked
      setQuestion({ ...question })
    }
  //送出按鈕
  function handleQuestionSubmit() {
    console.log('Sending')
    // chrome.runtime.sendMessage({
    //   contentScriptQuery: id == undefined ? 'addQuestion' : 'editQuestion',
    //   id: id,
    //   data: {
    //     title: question.title,
    //     options: question.options,
    //     checked: question.checked,
    //   },
    // })
    setSubmitQuestion(question)
    // window.setTimeout(() => navigate(-1), 1000)
  }
  //新增選項
  function addChoice() {
    var opt = [...question.options]
    var checked = [...question.checked]
    opt.push('')
    checked.push(false)
    setQuestion({ ...question, options: opt, checked: checked })
  }
  function removeChoice(idx: number) {
    var options = [...question.options]
    var checked = [...question.checked]
    options.splice(idx, 1)
    checked.splice(idx, 1)
    setQuestion({ ...question, options: options, checked: checked })
  }
  const menuItem = question.options.map((item, idx) => {
    var id = 'standard-adornment-option-' + idx
    var htmlfor = 'standard-adornment-option-' + idx

    return (
      <Box sx={{ flexDirection: 'row' }} key={'box' + idx}>
        <FormControl
          sx={{ m: 1, width: '60%' }}
          variant="standard"
          key={'form' + idx}
        >
          <InputLabel htmlFor={htmlfor}>選項{idx + 1}</InputLabel>
          <Input
            id={id}
            value={question.options[idx]}
            onChange={handleAnswerChange(idx)}
          />
        </FormControl>
        <Checkbox
          sx={{ mt: 2 }}
          checked={question.checked[idx]}
          onChange={handleCheckedChange(idx)}
          inputProps={{ 'aria-label': 'controlled-' + idx }}
        />
        <Button
          sx={{ width: '5%', mt: 2 }}
          key={idx}
          variant="outlined"
          onClick={() => {
            removeChoice(idx)
          }}
        >
          <DeleteIcon />
        </Button>
      </Box>
    )
  })
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Card sx={{ width: 400, height: 'auto', p: 5, m: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography>題目</Typography>
          <FormControl sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="standard-adornment-title">題目</InputLabel>
            <Input
              id="standard-adornment-title"
              value={question.title}
              onChange={handleChange}
            />
          </FormControl>
          <Typography sx={{ mt: 2 }}>選項</Typography>
          {/* <FormControl sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-option-a">選項A</InputLabel>
                        <Input
                            id="standard-adornment-option-a"
                            value={question.options[0]}
                            onChange={handleChange('optionA')}
                        />
                    </FormControl> */}
          {menuItem}
          <Button sx={{ m: 2 }} variant="outlined" onClick={addChoice}>
            新增選項
          </Button>
          <Button
            sx={{ m: 2 }}
            variant="outlined"
            onClick={handleQuestionSubmit}
          >
            送出
          </Button>

          {/* <Typography sx={{ mt: 2, mb: 2 }}>正確答案</Typography>
                    <p>測試(題目)：{question.title}</p>
                    <p>測試(選項)：{JSON.stringify(question.options)}</p>
                    <p>測試(正確答案)：{JSON.stringify(question.checked)}</p> */}
          {/* <p>測試 {JSON.stringify(res)}</p> */}
        </Box>
      </Card>
      {/* <ChoiceStudent {...submitQuestion} /> */}
    </Box>
  )
}
export default CreateChoice
