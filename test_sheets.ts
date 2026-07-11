import { google } from "googleapis";
import * as dotenv from "dotenv";
dotenv.config();

const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

console.log("Spreadsheet ID:", spreadsheetId);
console.log("Client Email:", clientEmail);
console.log("Private Key configured:", !!privateKey);

async function test() {
  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "employee",
    });
    console.log("Fetch success!");
    console.log("Headers:", response.data.values ? response.data.values[0] : "No data");
    console.log("Row count:", response.data.values ? response.data.values.length : 0);
  } catch (error) {
    console.error("Fetch failed with error:", error);
  }
}

test();
