import { Box, Card, FormLabel, TextField } from "@mui/material";

export default function CreateCourse() {
    return (
        <Box display='flex' alignItems='center' justifyContent='center' height='100%' width='100%'>
            <Card sx={{ width: '80%', height: '80%' }}>
                <TextField
                    id="course-create"
                    label="Helper text"
                    defaultValue="Default Value"
                    helperText="Some important text"
                    variant="standard"
                />
            </Card>
        </Box>
    )
}