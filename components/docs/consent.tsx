import { Card, Typography } from '@mui/material'
export const Consent = () => {
  return (
    <Card
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        mb: 2,
        overflowY: 'auto',
        zIndex: 11,
      }}
    >
      <Typography variant="h6" textAlign="center">
        <strong>蒐集個人資料告知事項暨個人資料提供同意書</strong>
      </Typography>
      <Typography variant="body2">
        　因應個人資料保護法之規定，在向您蒐集個人資料之前，依法向您告知下列事項，當您簽署這份同意書，表示您已閱讀、瞭解並同意接受本同意書之所有內容：
      </Typography>
      <Typography variant="body2" sx={{ marginTop: '8px' }}>
        <strong>一、蒐集目的及類別</strong>
      </Typography>
      <Typography variant="body2">
        　為了順利進行實驗研究，我們需要蒐集參與者的個人資料，包括但不限於：
        <br />
        <strong style={{ color: 'red' }}>學號</strong>、
        <strong style={{ color: 'red' }}>班級</strong>、
        <strong style={{ color: 'red' }}>姓名</strong>以及
        <strong style={{ color: 'red' }}>
          使用本實驗系統產生的所有電磁紀錄
        </strong>
        等資料。這些資料將用於研究分析、確認參與者身份以及內部管理等用途。
      </Typography>
      <Typography variant="body2">
        <strong>二、個人資料利用之期間、地區、對象及方式</strong>
      </Typography>
      <Typography variant="body2">
        　您的個人資料僅供本實驗單位於中華民國領域，於上述蒐集目的之必要合理範圍內加以利用至前述蒐集目的消失時為止。
      </Typography>
      <Typography variant="body2">
        <strong>三、當事人權利行使</strong>
      </Typography>
      <Typography variant="body2">
        　依據個人資料保護法第3條規定，您可向本實驗單位請求查詢或閱覽、製給複製本、補充或更正、停止蒐集/處理/利用或刪除您的個人資料。
      </Typography>
      <Typography variant="body2" sx={{ marginTop: '8px' }}>
        <strong>個人資料同意提供：</strong>
      </Typography>
      <Typography variant="body2">
        一、本人確已閱讀並瞭解上述告知事項，並按下「我同意」授權貴實驗單位於所列目的之必要合理範圍內，蒐集、處理及利用本人之個人資料。
      </Typography>
      <Typography variant="body2">
        二、本人瞭解此同意書符合個人資料保護法及相關法規之要求，並提供予貴實驗單位留存及日後查證使用。
      </Typography>
    </Card>
  )
}
