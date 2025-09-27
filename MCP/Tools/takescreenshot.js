import screenshot from "screenshot-desktop";
import fs from "fs/promises";
import path from "path";

export async function takeScreenshot() {
    const imgPath = path.resolve("./screenshot.png");

    // Take screenshot
    await screenshot({ filename: imgPath });

    // Read image and convert to base64
    const imgBuffer = await fs.readFile(imgPath);
    const base64Data = imgBuffer.toString("base64");
    const mimePrefix = "data:image/png;base64,";
    const blob = `${mimePrefix}${base64Data}`;

    // Return valid MCP response
    return {
        content: [
            {
                type: "text",
                text: "Screenshot taken successfully!"
            },
            // {
            //     type: "image",
            //     resource: {
            //         blob // ✅ This is what MCP wants
            //     }
            // }
        ]
    };
}
