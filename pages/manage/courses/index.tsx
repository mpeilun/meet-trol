import * as React from "react";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button, Box, Card,TextField,Typography } from "@mui/material";
import { borderRadius } from "@mui/system";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Home() {
  const [startDate, setStartDate] =useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [name,setName] = useState("")
  const [info,setInfo] = useState("")

  const handleChangeName = (event) => {   
    setName(event.target.value);
  }
  const handleChangeInfo = (event) => {   
    setInfo(event.target.value);
  }


  return (
    <Card  style={{ backgroundColor: "#F9F5E3"}} sx={{ mt: "1%",mr:"10%",ml:"10%"}}>
      <Box display="flex" flexDirection="row" sx={{ml:"12%"}} width="100%" height="100%">
        <Typography variant="h2" sx={{mt:"20%"}} fontWeight="bold">新增一個課程</Typography>
        <img src="https://i.imgur.com/6QxVhMt.png" width={500} height="auto"/>
      </Box>
        <Box justifyContent="start" flexDirection="column" sx={{ml:"25%"}}>
          <Box flexDirection="column" >
            <h2 >課程名稱</h2>
            <TextField
              required
              id="outlined-required"
              label="名稱"
              style={{ backgroundColor: "#F4F2F3", borderRadius: "5px" }}
              onChange={handleChangeName}
            />
          </Box>
          <Box flexDirection="column">
            <h2>簡介</h2>
            <TextField
              id="filled-basic"
              label="說明"
              multiline
              color="primary"
              style={{ backgroundColor: "#F4F2F3", borderRadius: "5px" }}
              onChange={handleChangeInfo}
            />
          </Box>
          <Box flexDirection="column">
            <h2>開放時間</h2>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              localeText={{ start: "開始", end: "結束" }}
            >
              <DatePicker
                label="開始日期"
                value={startDate}
                onChange={(newStart) => setStartDate(newStart)}
                sx={{mr:2,backgroundColor:"#F4F2F3"}}
              />
              <DatePicker
                label="結束日期"
                value={endDate}
                onChange={(newEnd) => setEndDate(newEnd)}
                sx={{backgroundColor:"#F4F2F3"}}
              />

            </LocalizationProvider>
          </Box>
          <Box
            sx={{ mt: 5, mb: 6 }}
          >
            <Button variant="contained" size="medium">
              新增課程
            </Button>
            <Typography>{name} {info}</Typography>
          </Box>
        </Box>
      </Card>
  );
}
