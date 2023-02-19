import * as React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Button from '@mui/material/Button'

export default function SingleChoice(props: { handleClose: () => void }) {
  const [value, setValue] = React.useState('')
  const [error, setError] = React.useState(false)
  const [helperText, setHelperText] = React.useState('')

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
    setHelperText(' ')
    setError(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (value === 'best') {
      setHelperText('答對了！')
      setError(false)
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true)
        }, 1000)
      }).then(() => {
        // props.handleClose()
      })
    } else if (value === 'worst') {
      setHelperText('你答錯囉！')
      setError(true)
    } else {
      setHelperText('請選取一個選項。')
      setError(true)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ pt: 1 }} error={error} variant="standard">
        <FormLabel id="demo-error-radios">
          請問 string.xml 是放在哪個資料夾？
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-error-radios"
          name="quiz"
          value={value}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            value="best"
            control={<Radio />}
            label="/res/values/"
          />
          <FormControlLabel value="worst" control={<Radio />} label="/java/" />
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
        <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
          確認答案
        </Button>
      </FormControl>
    </form>
  )
}
