import { config } from "dotenv";
import { google } from "googleapis";

config();

export async function getclasses(day, range = "Sheet1!A1:G10") {
    console.log('Google API Key:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    
  try {
    // Authenticate with Google Service Account
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // JSON key
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = process.env.SHEET_ID;

    // Fetch values from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      return {
        content: [{ text: "No data found in the sheet.", type: "text" }],
      };
    }

    // First row = header, skip it
    const body = rows.slice(1);

    // Find row matching the given day
    const row = body.find(r => r[0]?.toLowerCase() === day.toLowerCase());

    if (!row) {
      return {
        content: [{ text: `⚠️ No classes found for "${day}".`, type: "text" }],
      };
    }

    // Subjects = all columns after Day
    const subjects = row.slice(1).filter(Boolean);

    return {
      content: [
        {
          text: `📅 Timetable for ${day}:\n\n${subjects.join(", ")}`,
          type: "text",
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          text: `❌ Could not fetch data from Google Sheets. Error: ${error.message}`,
          type: "text",
        },
      ],
    };
  }
}
