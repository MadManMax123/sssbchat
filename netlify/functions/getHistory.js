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

exports.handler = async () => {
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.google_sheets.spreadsheet_id,
      range: `${config.google_sheets.sheet_name}!A:D`
    });

    const rows = response.data.values || [];
    const history = rows.slice(1).map(([timestamp, sender, receiver, message]) => ({
      timestamp,
      sender,
      receiver,
      message
    }));

    return { statusCode: 200, body: JSON.stringify(history) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
