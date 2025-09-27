import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import { createPost } from "./Tools/createPost.js";
import { getWhether } from "./Tools/getWhether.js";
import { getYoutubeVideos } from "./Tools/getutubevideos.js";
import { getChannelVideos } from "./Tools/getChannel.js";
import { adjustVolume } from "./Tools/loudness.js";
import { takeScreenshot } from "./Tools/takescreenshot.js";
import { timetable } from "./Tools/timetable.js";

const server = new McpServer({
    name: "example-server",
    version: "1.0.0"
});

const app = express();

// 🔧 Register tools

server.tool(
    "addTwoNumbers",
    "Add two numbers",
    {
        a: z.number(),
        b: z.number()
    },
    async ({ a, b }) => ({
        content: [
            {
                type: "text",
                text: `The sum of ${a} and ${b} is ${a + b}`
            }
        ]
    })
);

server.tool(
    "createPost",
    "Create a post on X (formerly Twitter)",
    {
        status: z.string()
    },
    async ({ status }) => createPost(status)
);

server.tool(
    "getWhether",
    "Get the weather for a city",
    {
        city: z.string()
    },
    async ({ city }) => getWhether(city)
);

// 🆕 New YouTube Search Tool
server.tool(
    "getYoutubeVideos",
    "Search YouTube videos by query",
    {
        query: z.string()
    },
    async ({ query }) => getYoutubeVideos(query)
);

server.tool(
    "getChannelVideos",
    "Search YouTube videos by channel ID",
    {
        query: z.string()
    },
    async ({ query }) => getChannelVideos(query)
);

server.tool(
    "adjustVolume",
    "Increase or decrease system volume",
    {
      direction: z.enum(["up", "down"]).optional(),
      amount: z.number().optional()
    },
    async (args) => {
      const direction = args.direction || "up";         // default to increase
      const amount = Math.max(1, args.amount || 10);    // fallback to 10, clamp minimum to 1
      return adjustVolume(direction, amount);
    }
  );
  
  
  server.tool(
    "takeScreenshot",
    "Takes a screenshot and returns the image",
    {},
    async () => takeScreenshot()
  );

  server.tool(
    "getclasses",
    "Get Classes depending upon the day",
    {
        day: z.string()
    },
    async ({ day }) => {
        return timetable(day);
    }
  )

// 🔁 Manage transport sessions for multiple clients
const transports = {};

app.get('/health',async(req,res)=>{
    res.send("Running")
  })

app.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport("/messages", res);
    transports[transport.sessionId] = transport;

    res.on("close", () => {
        delete transports[transport.sessionId];
    });

    await server.connect(transport);
});

app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId;
    const transport = transports[sessionId];

    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send("No transport found for sessionId");
    }
});

app.listen(3001, () => {
    console.log("✅ MCP Server is running on http://localhost:3001");
});
