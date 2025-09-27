import { config } from "dotenv";
config();

export async function getYoutubeVideos(query) {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=3&type=video&key=${process.env.YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    console.log("Response from getYoutubeVideos:", response);
    console.log("Data from getYoutubeVideos:", data);

    // Handle error from API
    if (!response.ok || data.error) {
        const message = data.error?.message || "An unknown error occurred.";
        return {
            content: [
                {
                    text: `Could not fetch YouTube videos for "${query}". Error: ${message}`,
                    type: "text"
                }
            ]
        };
    }

    // Format results
    const results = data.items.map((item) => {
        const title = item.snippet.title;
        const videoId = item.id.videoId;
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        return `• ${title}\n${url}`;
    });

    return {
        content: [
            {
                text: `Top YouTube results for "${query}":\n\n${results.join("\n\n")}`,
                type: "text"
            }
        ]
    };
}
