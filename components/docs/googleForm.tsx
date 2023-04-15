import { Typography } from '@mui/material'
import { useRef, useState } from 'react'

interface Props {
  formType: 'preTest' | 'postTest'
  isFormSubmitted: boolean
  setIsFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>
}

export const GoogleForm = (props: Props) => {
  const preTestUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSc4Tgwb7foIZRJinEBz9qOgdyZ09mNJ1CsRc0MgNdgVp_IElg/viewform'
  const postTestUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLScf2DIJixUmA9yfouAADf36zwLwJpBjOoAeXtW7RG0_5_RBnQ/viewform'
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [changeCount, setChangeCount] = useState(0)
  const handleUrl = (formType: 'preTest' | 'postTest') => {
    return formType === 'preTest' ? preTestUrl : postTestUrl
  }
  const onLoad = () => {
    if (changeCount == 1) {
      props.setIsFormSubmitted(true)
    } else {
      setChangeCount(changeCount + 1)
    }
  }

  return (
    <>
      <Typography variant="h5" textAlign="center">
        {props.formType === 'preTest' ? '前測表單' : '後測表單'}
      </Typography>
      {!props.isFormSubmitted && (
        <iframe
          src={handleUrl(props.formType)}
          height={400}
          ref={iframeRef}
          onLoad={onLoad}
          style={{
            height: '80vh',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            border: '2px solid #ccc',
            borderRadius: '10px',
          }}
        />
      )}
      {props.isFormSubmitted && (
        <div>
          <Typography variant="h6" textAlign="center">
            感謝填寫表單！
          </Typography>
          {props.formType === 'postTest' && (
            <Typography variant="h6" textAlign="center">
              謝謝您參與測試，可以直接關閉視窗並離開了。
            </Typography>
          )}
        </div>
      )}
    </>
  )
}
