import { Close } from '@mui/icons-material';
import { Box, Button, Card, Divider, Typography, FormControl, TextField, FormHelperText } from '@mui/material';
import * as React from 'react'
// import UploadImage from '../../photo/uploadImage';

interface CreateDiscussionProps {
    timing: number,
    duration: number,
    chapterId: string,
    courseId: string,
    displayCreateDiscussion: boolean,
    setDisplayCreateDiscussion: React.Dispatch<React.SetStateAction<boolean>>
}
const CreateDiscussion = (props: CreateDiscussionProps) => {
    const { timing, duration, chapterId, displayCreateDiscussion, setDisplayCreateDiscussion } = props
    const [title, setTitle] = React.useState('')
    const [content, setContent] = React.useState('')
    const [titleError, setTitleError] = React.useState(false)
    const [timeError, setTimeError] = React.useState('')
    const [contentError, setContentError] = React.useState(false)
    const [minutes, setMinutes] = React.useState(0)
    const [seconds, setSeconds] = React.useState(0)

    React.useEffect(() => {
        setMinutes(Math.floor(timing / 60));
        setSeconds(Math.floor(timing % 60));
    }, [timing])

    const handleMinutesChange = (event) => {
        const value = parseInt(event.target.value)
        if (value < 0) {
            setTimeError('分鐘不能為負數');
        } else if ((value*60 + seconds) > duration) {
            setTimeError('時間超過影片時長');
        } else {
            setTimeError('');
            setMinutes(value);
        }
    };

    const handleSecondsChange = (event) => {
        const value = parseInt(event.target.value)
        if (value < 0) {
            setTimeError('秒數不能為負數');
        } else if (value >= 60) {
            setTimeError('秒數不能超過 59')
        } else if (minutes * 60 + value > duration) {
            setTimeError('時間超過影片時長');
        } else {
            setTimeError('');
            setSeconds(value);
        }
    };

    const handleSubmit = () => {
        if (!title.trim() || title.length > 15) {
            setTitleError(true);
            return;
        }
        setTitleError(false);

        if (!content.trim() || content.length > 100) {
            setContentError(true);
            return;
        }
        setContentError(false);

        // handle form submission here
    };

    return (
        <Card sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            height: '75%',
            width: '50%',
            // display: displayCreateDiscussion ? 'block' : 'none',
            p: 2,
            transition: 'opacity 0.3s ease-in-out',
            opacity: displayCreateDiscussion ? 1 : 0,
            visibility: displayCreateDiscussion ? 'visible' : 'hidden',
            pointerEvents: displayCreateDiscussion ? 'auto' : 'none',
            overflowY: 'auto',
        }}>
            
            <div style={{ position: 'sticky', top: 10, backgroundColor: 'white'}}>
                <Button onClick={() => { setDisplayCreateDiscussion(false) }} sx={{ position: 'absolute', right: 10 }}><Close /></Button>
                <Typography variant='h5' m={1}>新增討論區</Typography>
                <Divider />
            </div>

            {duration}
            {'/'}
            {minutes * 60 + seconds}
            {'/'}
            {chapterId}
            <FormControl fullWidth sx={{ mt: 2 }}>
                <TextField
                    id="title"
                    label="標題"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={titleError}
                    helperText={titleError && '請輸入 1 到 15 字元'}
                />
                <Box my={2}>
                    <TextField
                        id="minutes"
                        label="分"
                        type="number"
                        value={minutes}
                        onChange={handleMinutesChange}
                        error={timeError !== ''}
                    />
                    <TextField
                        id="seconds"
                        label="秒"
                        type="number"
                        value={seconds}
                        onChange={handleSecondsChange}
                        error={timeError !== ''}
                    />
                    {(timeError !== '') && (<FormHelperText error>{timeError}</FormHelperText>)}
                </Box>

                <TextField
                    id="content"
                    label="內容"
                    multiline
                    minRows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    error={contentError}
                    helperText={contentError && '請輸入 1 到 100 字元'}
                    sx={{ mt: 2 }}
                />
                {/* <UploadImage /> */}
                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                    送出
                </Button>
            </FormControl>


        </Card>
    )
}

export default CreateDiscussion;