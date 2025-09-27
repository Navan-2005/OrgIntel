// Data from the Google Sheet, stored in a JavaScript object.
const schedule = {
    monday: ["DBMS Lab", "Open", "Compilers", "Java", "ML"],
    tuesday: ["Open", "Compilers", "DBMS", "ML", "Java", "Networks"],
    wednesday: ["Net Lab", "Open"],
    thursday: ["DBMS", "Networks", "ML"],
    friday: ["Compilers", "Java", "Networks", "DBMS"],
    saturday: ["Java", "Compilers", "DBMS", "Networks"]
};

// The header row from the sheet. We'll use this to provide context if needed.
const header = ["Day", "Subjects"]; // Simplified header for this use case

/**
 * Fetches the list of subjects for a given day from the hardcoded schedule.
 * @param {string} day - The day of the week (e.g., "Monday", "tuesday").
 * @returns {Promise<object>} An MCP-formatted response object.
 */
export async function timetable(day) {
    try {
        if (!day || typeof day !== 'string') {
            throw new Error("A valid day was not provided.");
        }

        // Normalize the input day to lowercase to match the object keys
        const formattedDay = day.trim().toLowerCase();

        // Find the subjects for the given day in our schedule object
        const subjectsForDay = schedule[formattedDay];

        // Handle cases where the day is not found
        if (!subjectsForDay) {
            return {
                content: [{
                    type: "text",
                    text:  `No classes found for "${day}". Please provide a day from Monday to Saturday`
                }],
            };
        }

        // Filter out any "Open" periods to only show actual subjects
        const actualSubjects = subjectsForDay.filter(subject => subject.toLowerCase() !== 'open');
        
        // Handle cases where a day has no actual subjects scheduled (e.g., only "Open" slots)
        if (actualSubjects.length === 0) {
            return {
                content: [{
                    type: "text",
                    text: `✅ No classes are scheduled for ${day}. It's an open day!`
                }],
            };
        }

        // Format the output string
        const responseText = `📅 Timetable for ${day}:\n\n- ${actualSubjects.join("\n- ")}`;

        return {
            content: [{
                type: "text",
                text: responseText
            }],
        };

    } catch (err) {
        // Handle any unexpected errors
        return {
            content: [{
                type: "text",
                text: `❌ An unexpected error occurred: ${err.message}`
            }],
        };
    }
}

// --- Example of how to test this file directly ---
// To test, you can uncomment the following lines and run node timetable.js
/*
async function test() {
    const day = "Tuesday";
    const result = await timetable(day);
    console.log(result.content[0].text);
    
    console.log("\n------------------\n");
    
    const anotherDay = "Sunday";
    const anotherResult = await timetable(anotherDay);
    console.log(anotherResult.content[0].text);
}

test();
*/