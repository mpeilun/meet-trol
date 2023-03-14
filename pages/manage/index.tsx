import * as React from "react";
import {
  Button,
  Box,
  Card,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  Divider,
  InputLabel,
  MenuItem
} from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";



export default function Teacherpage() {
  const [chapter, setChapter] = useState([]); //章節狀態
  const [chapterDialogText,setChapterDialogText] = useState([]); //Dialog輸入文字狀態
  const [openChapterDialog, setOpenChapterDialog] = React.useState(false);//新增章節Dialog開關狀態

  const [video, setVideo] = useState([]); //影片狀態
  const [videoDialogText,setVideoDialogText] = useState([]); //Dialog輸入文字狀態
  const [openVideoDialog, setOpenVideoDialog] = React.useState(false);//新增影片Dialog開關狀態

  const handleOpenChapterDialog = () => setOpenChapterDialog(true);//Dialog開
  const handleCloseChapterDialog = () => setOpenChapterDialog(false);//Dialog關

  const handleOpenVideoDialog = () => setOpenVideoDialog(true);//Dialog開
  const handleCloseVideoDialog = () => setOpenVideoDialog(false);//Dialog關

  const handleChangeChapter = (event) => {   //改變ChapterDialog文字狀態
    setChapterDialogText(event.target.value);
  }

  const handleAddChapter = () => {       //增加章節名稱
    
    setChapter(prevState => [
      ...prevState,
      chapterDialogText,
      <Divider />
    ]);
    console.log("chapter",chapter);
  };  

  const handleDialogAndChapter = () =>{ //按下新增按鈕後，關掉Dialog，增加章節
    handleCloseChapterDialog();
    handleAddChapter();
  }

  const handleChangeVideo = (event) => {   //改變VideoDialog文字狀態
    setVideoDialogText(event.target.value);
  }
  const handleAddVideo = () => {       //增加影片
    const newVideo = [
      ...video,
      // chapter.slice(0,index),
      // video,
      videoDialogText,
      // chapter.slice(index)
    ];
    setVideo(newVideo);
    console.log("newVideo",newVideo);
    console.log("chapter",chapter);
  };  
  const handleDialogAndVideo = () =>{  //按下新增按鈕後，關掉Dialog，增加影片
    handleCloseVideoDialog();
    handleAddVideo();
  }
  // const handleInsert = () =>{
    
  //   setVideo(prevState=>[...chapter.slice(0,index),video,...chapter.slice(index)])
  // }
  const [index,setIndex] = useState(0);   //使用者選擇插入的陣列位置
  const [insert,setInsert] = useState([]); //插入陣列

  const handleSelect = (event: SelectChangeEvent) => {   //讀取位置
    setIndex(parseInt(event.target.value) );
  };

  const handleInsert = () =>{
    const newInsert = [
      // ...chapter,
      chapter.slice(0,index),
      video,
      // videoDialogText,
      chapter.slice(index)
    ]
    setChapter(newInsert)
    console.log("chapter",chapter);
  }



  return (
    <Box>
      <Card
        style={{ backgroundColor: "#F9F5E3" }}
        sx={{mt:"1%", mr: "17%", ml: "17%" }}
      >
        <Box
          display="flex"
          justifyContent="start"
          flexDirection="column"
          sx={{ ml: "13%",width:700}}
        >
          <Box display={"flex"} flexDirection="row" sx={{ my:2 }} bgcolor="#D4C5C7" width="100%">
            <Typography sx={{fontSize:35 ,fontWeight:"bold" }}>課程名稱:</Typography>
            <Typography sx={{ml:4,fontSize:35 ,fontWeight:"bold" }}>{/*這裡放課程名稱*/}行動裝置</Typography>
          </Box>

          {/* <Box>
            {video.map((item, index) => (
              <Typography key={index} sx={{fontSize:25}}>
                {item}
              </Typography>
              ))}
          </Box> */}
          <Box>
            {chapter.map((item, index) => (
            <Typography key={index} sx={{fontSize:25, mt:3}} fontWeight="bold">
              {item}
            </Typography>
            ))}
          </Box>

          <Box sx={{ mt: 15, mb: 8 }}>
            <Button
              onClick={handleOpenChapterDialog}
              variant="contained"
              size="medium"
              startIcon={<AddCircleOutlineIcon />}
            >
              新增章節
            </Button>
            <Button
              onClick={handleOpenVideoDialog}
              variant="contained"
              size="medium"
              sx={{ml:2}}
              startIcon={<AddCircleOutlineIcon />}
            >
              新增影片
            </Button>

            <Dialog 
              open={openChapterDialog}
              onClose={handleCloseChapterDialog}
              >
                <DialogTitle bgcolor={"#D4C5C7"} fontWeight="bold">
                  新增章節
                </DialogTitle>
          
                <TextField
                  required
                  // id="outlined-required"
                  // label="章節名稱"
                  // style={{ backgroundColor: "#F4F2F3", borderRadius: "5px"  }}
                  // sx={{mt:5}}
                  sx={{mx:5,mt:5,mb:10 ,width:300}}
                  autoFocus
                  // margin="dense"
                  id="name"
                  label="名稱"
                  fullWidth
                  variant="standard"
                  onChange={handleChangeChapter}
                  >
                </TextField  >
                <Button onClick={handleDialogAndChapter} variant="contained" sx={{mx:5,mb:1}}>
                  新增
                </Button>
            </Dialog>

            <Dialog 
              open={openVideoDialog}
              onClose={handleCloseVideoDialog}
              >
                <DialogTitle bgcolor={"#D4C5C7"} fontWeight="bold">
                  新增影片
                </DialogTitle>

                <TextField
                  required
                  id="outlined-required"
                  sx={{mx:5,my:3,width:300}}
                  autoFocus
                  label="名稱"
                  fullWidth
                  variant="standard"
                  onChange={handleChangeVideo}
                  >
                </TextField>

                <Typography fontSize={17} sx={{ml:3}}>
                  選取章節
                </Typography>
                <FormControl sx={{mx:2,my:2}}>
                  <InputLabel id="demo-simple-select-label"></InputLabel>
                  <Select
                    id="demo-simple-select"
                    value={index.toString()}
                    label="Age"
                    onChange={handleSelect}     
                  >
                    {/*下面要改成讀資料庫的章節名稱*/}
                    <MenuItem value={2}>章節一</MenuItem>   
                    <MenuItem value={4}>章節二</MenuItem>
                    <MenuItem value={6}>章節三</MenuItem>
                  </Select>
                </FormControl>

                
                <TextField
                  label="影片連結"
                  sx={{mb:3,mx:2}}
                >
                </TextField>
                <Button onClick={handleInsert} variant="contained" sx={{mx:5,mb:2}}>
                  新增
                </Button>
            </Dialog>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}