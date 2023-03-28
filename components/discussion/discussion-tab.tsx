import { Box, Card, Typography } from "@mui/material"
import { discussions } from "./testdata"

const DiscussionTab = () => {
    const discussionCard = discussions.map((discussion, index) => {
        return(
            <Card key={`discussion-${index}`} sx={{p:5, m:1}}>
                <Typography>{discussion.title}</Typography>
            </Card>
        )
    })
    return(
        <Box>{discussionCard}</Box>
    )
}

export default DiscussionTab