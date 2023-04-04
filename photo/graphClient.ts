
// grant_type: "client_credentials",
// client_id: "16e21955-50b4-44be-8e7e-9e3170db7f64",
// client_secret: "Dvk8Q~kScwD7GJ.bjS_jh8EAnPnljUdlsWz_rae5",
// scope: "https://graph.microsoft.com/.default",


import { Client } from "@microsoft/microsoft-graph-client";

export const uploadImage = async (file: File) => {
  const clientId = "16e21955-50b4-44be-8e7e-9e3170db7f64";
  const clientSecret = "Dvk8Q~kScwD7GJ.bjS_jh8EAnPnljUdlsWz_rae5";
  const scopes = ["https://graph.microsoft.com/.default"];
  const tenantId = "6614bde6-0eb1-4cbf-a4f4-bdc5ed185995";

  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const data = new URLSearchParams();
  data.append("grant_type", "client_credentials");
  data.append("client_id", clientId);
  data.append("client_secret", clientSecret);
  data.append("scope", scopes.join(" "));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data,
  });

  const json = await response.json();

  const accessToken = json.access_token;

  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

  const fileName = file.name;
  const fileContent = file;
  const driveItem = await client
    .api(`/me/drive/root:/Photo/${fileName}:/content`)
    .put(fileContent);

  return driveItem;
};