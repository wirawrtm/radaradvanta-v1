import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

async function checkAppendedPartner() {
  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    
    console.log("Fetching values from 'channel' sheet...");
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "channel!A1:Z1500",
    });
    
    const rows = res.data.values || [];
    console.log("Total rows in channel:", rows.length);
    
    // Check if any row contains "Test Partner"
    const matched = rows.filter(row => 
      row.some(cell => String(cell).toLowerCase().includes("test partner"))
    );
    console.log("Found appended test partners:", matched);
  } catch (error: any) {
    console.error("Error:", error);
  }
}

checkAppendedPartner();
