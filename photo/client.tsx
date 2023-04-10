import React, { useState } from "react";
import { MsalAuthProvider, LoginType } from "react-aad-msal";
import { PublicClientApplication } from "@azure/msal-browser";
import { Client } from "@microsoft/microsoft-graph-client";

const clientId = "YOUR_CLIENT_ID"; // 請填入您的應用程式的 client_id
const scopes = ["User.Read", "Files.ReadWrite"]; // 權限範圍，此範例為讀取使用者資訊以及上傳檔案
const authority = "https://login.microsoftonline.com/common"; // 登入驗證伺服器的網址，此範例為 Microsoft 帳戶

const msalConfig = {
    auth: {
        clientId: 'YOUR_CLIENT_ID',
        authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
        redirectUri: 'http://localhost:3000',
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true,
    },
};

const msalInstance = new PublicClientApplication(msalConfig);

const authProvider = new MsalAuthProvider(msalInstance, {
    scopes: ['https://graph.microsoft.com/.default'],
});

const options = {
    loginType: LoginType.Redirect,
    tokenRefreshUri: window.location.origin + "/auth.html",
};


const uploadImage = async (file) => {
    const client = Client.init({
        authProvider: authProvider.getAuthHeader,
    });

    const fileName = file.name;
    const fileContent = file;
    const driveItem = await client
        .api(`/me/drive/root:/${fileName}:/content`)
        .put(fileContent);

    return driveItem;
};

export const UploadImage = () => {
    const [file, setFile] = useState(null);

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
    };

    const handleUpload = async () => {
        if (file) {
            try {
                const result = await uploadImage(file);
                console.log("File uploaded to OneDrive: ", result);
            } catch (error) {
                console.error("Error uploading file: ", error);
            }
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileUpload} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};
