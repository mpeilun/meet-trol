import Script from 'next/script'
import { useEffect } from 'react'
declare var webgazer: any

function Page() {
  return (
    <>
      <Script
        src="../external-lib/webgazer.js"
        onLoad={() => {
          webgazer
            .setGazeListener(function (data: { x: any; y: any } | null, elapsedTime: any) {
              if (data == null) {
                return
              }
              var xPrediction = data.x //these x coordinates are relative to the viewport
              var yPrediction = data.y //these y coordinates are relative to the viewport
              console.log(xPrediction, yPrediction, elapsedTime) //elapsed time is based on time since begin was called
            })
            .begin()

          webgazer.showVideoPreview(true).showPredictionPoints(true)
        }}
      />
      <p>Test Page for Webgazer</p>
    </>
  )
}

export default Page
