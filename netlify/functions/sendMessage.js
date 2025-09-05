const { google } = require("googleapis");
const config = require("../../config.json");

async function getAuth() {
  const auth = new google.auth.JWT(
    config.google_sheets.service_account.client_email,
    null,
    config.google_sheets.service_account.private_key.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  return auth;
}

exports.handler = async (event) => {
  try {
    const { sender, receiver, message } = JSON.parse(event.body || "{}");
    const timestamp = new Date().toISOString();

    const auth = await getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.google_sheets.spreadsheet_id,
      range: `${config.google_sheets.sheet_name}!A:D`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[timestamp, sender, receiver, message]]
      }
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
