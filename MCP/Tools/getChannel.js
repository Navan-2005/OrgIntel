import { config } from "dotenv";
config();

export async function getChannelVideos(channelId) {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=3&order=date&type=video&key=${process.env.YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    console.log("Response from getChannelVideos:", response);
    console.log("Data from getChannelVideos:", data);

    // Handle error
    if (!response.ok || data.error) {
        const message = data.error?.message || "An unknown error occurred.";
        return {
            content: [
                {
                    type: "text",
                    text: `Could not fetch videos for channel ${channelId}. Error: ${message}`
                }
            ]
        };
    }

    const results = data.items.map((item) => {
        const title = item.snippet.title;
        const videoId = item.id.videoId;
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        return `• ${title}\n${url}`;
    });

    return {
        content: [
            {
                type: "text",
                text: `Latest videos from channel:\n\n${results.join("\n\n")}`
            }
        ]
    };
}
