import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

async function checkUserSearch() {
  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    
    console.log("Fetching values from 'employee' sheet...");
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "employee!A1:Z500",
    });
    
    const rows = res.data.values || [];
    
    const matchedWira = rows.filter(row => 
      row.some(cell => String(cell).toLowerCase().includes("wira"))
    );
    console.log("Matches for 'wira':", matchedWira);

    const matchedBatik = rows.filter(row => 
      row.some(cell => String(cell).toLowerCase().includes("batik"))
    );
    console.log("Matches for 'batik':", matchedBatik);
    
  } catch (error: any) {
    console.error("Error:", error);
  }
}

checkUserSearch();
