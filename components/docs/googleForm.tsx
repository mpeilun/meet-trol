import { Typography } from "@mui/material";
import { useRef, useState } from "react";

interface Props {
  formType: "preTest" | "postTest";
  isFormSubmitted: boolean;
  setIsFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GoogleForm = (props: Props) => {
  const preTestUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc4Tgwb7foIZRJinEBz9qOgdyZ09mNJ1CsRc0MgNdgVp_IElg/viewform';
  const postTestUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSerherherherherherrherRc0MgNdgVp_IElg/viewform';
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [changeCount, setChangeCount] = useState(0);
  const handleUrl = (formType: 'preTest' | 'postTest') => {return formType === 'preTest' ? preTestUrl : postTestUrl}
  const onLoad = () => {
    if (changeCount == 1) {
      props.setIsFormSubmitted(true);
    } else {
      setChangeCount(changeCount + 1)
    }
  }

  return (
    <>
      <Typography variant="h5" textAlign='center'>
        {props.formType === 'preTest' ? '前測表單' : '後測表單'}
      </Typography>
      {!props.isFormSubmitted && (
        <iframe src={handleUrl(props.formType)} height={400} ref={iframeRef} onLoad={onLoad} style={{height:'80vh'}}/>
      )}
      {props.isFormSubmitted && (
        <Typography variant="h6" textAlign='center'>
          感謝填寫表單！
        </Typography>
      )}
    </>
  );
};
