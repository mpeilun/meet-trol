import React, { useState } from 'react';
import {uploadImage} from './graphClient'

function UploadImage() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('請選擇要上傳的檔案');
      return;
    }

    try {
      const uploadedItem = await uploadImage(selectedFile);
      console.log(`檔案 ${uploadedItem.name} 已上傳至 OneDrive`);
    } catch (error) {
      console.error('上傳失敗', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={handleUpload}>上傳至 OneDrive</button>
    </div>
  );
}

export default UploadImage;
