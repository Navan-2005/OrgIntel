const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { SSEClientTransport } = require('@modelcontextprotocol/sdk/client/sse.js');
const { config } = require('dotenv');

config();

const router = express.Router();
let tools = [];
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const mcpClient = new Client({ name: 'example-client', version: '1.0.0' });

console.log('API Key:', process.env.GEMINI_API_KEY);

const chatHistories = new Map(); // userId => history[]

// Initialize MCP connection
async function initializeMCP() {
  try {
    await mcpClient.connect(new SSEClientTransport(new URL('http://localhost:3001/sse')));
    console.log('Connected to MCP server');

    tools = (await mcpClient.listTools()).tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: {
        type: tool.inputSchema.type,
        properties: tool.inputSchema.properties,
        required: tool.inputSchema.required
      }
    }));
  } catch (error) {
    console.error('Failed to initialize MCP:', error);
  }
}

// Initialize on module load
initializeMCP();

// Endpoint for receiving user message
router.post('/chat', async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message are required' });
  }

  // Initialize history if not exists
  if (!chatHistories.has(userId)) {
    chatHistories.set(userId, []);
  }

  const chatHistory = chatHistories.get(userId);
  chatHistory.push({ role: 'user', parts: [{ text: message, type: 'text' }] });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: chatHistory,
      config: { tools: [{ functionDeclarations: tools }] }
    });

    const candidate = response?.candidates?.[0];
    const parts = candidate?.content?.parts;
    if (!parts || parts.length === 0) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    const part = parts[0];
    const functionCall = part.functionCall;
    const responseText = part.text || '';

    if (functionCall) {
      console.log('Calling tool:', functionCall.name);
      const toolResult = await mcpClient.callTool({
        name: functionCall.name,
        arguments: functionCall.args
      });

      let toolResponseText = 'Tool returned an invalid or empty response.';
      if (toolResult?.content?.[0]?.text) {
        toolResponseText = toolResult.content[0].text;
      }

      chatHistory.push({ role: 'model', parts: [{ text: `Tool result: ${toolResponseText}`, type: 'text' }] });

      return res.json({ response: toolResponseText });
    }

    chatHistory.push({ role: 'model', parts: [{ text: responseText, type: 'text' }] });
    console.log("Response from AI:", responseText);
     
    return res.json({ response: responseText });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
});

module.exports = router;