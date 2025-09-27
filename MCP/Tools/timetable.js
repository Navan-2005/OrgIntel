import { config } from "dotenv";
config();

export async function timetable(day, range = "Sheet1!A1:G10") {
    const spreadsheetId = process.env.SHEET_ID;
    const apiKey = process.env.SHEETS_API_KEY;

    const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
    );
    const data = await response.json();

    // Handle error from API
    if (!response.ok || data.error) {
        const message = data.error?.message || "An unknown error occurred.";
        return {
            content: [
                {
                    text: `❌ Could not fetch data from Google Sheets. Error: ${message}`,
                    type: "text"
                }
            ]
        };
    }

    const rows = data.values || [];
    if (rows.length === 0) {
        return {
            content: [
                {
                    text: "No data found in the sheet.",
                    type: "text"
                }
            ]
        };
    }

    // First row is header, so skip it
    const header = rows[0];
    const body = rows.slice(1);

    // Find the row matching the given day (case-insensitive)
    const row = body.find(r => r[0]?.toLowerCase() === day.toLowerCase());

    if (!row) {
        return {
            content: [
                {
                    text: `⚠️ No classes found for "${day}".`,
                    type: "text"
                }
            ]
        };
    }

    // Collect subjects (skip the first column since it's the day)
    const subjects = row.slice(1).filter(Boolean); // remove empty cells

    return {
        content: [
            {
                text: `📅 Timetable for ${day}:\n\n${subjects.join(", ")}`,
                type: "text"
            }
        ]
    };
}
