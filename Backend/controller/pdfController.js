const { GoogleGenerativeAI } = require('@google/generative-ai');
const { main, searchWithContext, storechatHistory, getChatHistory } = require('../service/pdf.js');

class PDFController {
    // Process uploaded PDFs
    async processPDFs(req, res) {
        try {
            const files = req.files;
            const sessionId = req.body.sessionId || `session-${Date.now()}`;

            if (!files || files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }

            for (let i = 0; i < files.length; i++) {
                const buffer = files[i].buffer;
                const fileId = files[i].originalname || `file-${i}`;
                await main(buffer, '', fileId);
            }

            res.status(200).json({
                message: 'PDFs processed successfully',
                sessionId
            });
        } catch (error) {
            console.error('Error processing PDFs:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Handle chat with context
    async chat(req, res) {
        try {
            const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
            const { question, sessionId } = req.body;

            if (!question || !sessionId) {
                return res.status(400).json({ error: 'Question and sessionId are required' });
            }

            // Get relevant documents and chat history
            const { documents, chatHistory } = await searchWithContext(question, sessionId);
            const context = documents.join('\n');

            // Format chat history for context
            const historyContext = chatHistory.length > 0
                ? chatHistory.map(chat => `Previous Q: ${chat.question}\nPrevious A: ${chat.answer}`).join('\n\n')
                : '';

            const prompt = `
You are a helpful PDF assistant chatbot. Use the context below to answer the question.

Consider the previous conversation history to provide more relevant and contextual answers. Explain the concept in so simple and detail that even the new user should understand it at once.

Document Context: ${context}

Previous Conversation History: ${historyContext}

Current Question: ${question}

Instructions:
- If the question relates to previous conversation, acknowledge it and build upon it
- If it's a new topic, focus on the document context
- Be conversational and helpful
- If you cannot find the answer in the context, say so politely
`;

            const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
            const response = await model.generateContent(prompt);
            const answer = response.response.text();

            // Store this conversation in chat history
            await storechatHistory(sessionId, question, answer);

            res.status(200).json({
                answer,
                sessionId
            });
        } catch (error) {
            console.error('Error in chat:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Get chat history for a session
    async getChatHistory(req, res) {
        try {
            const { sessionId } = req.params;
            const limit = parseInt(req.query.limit) || 20;

            const chatHistory = await getChatHistory(sessionId, limit);
            res.status(200).json({ chatHistory });
        } catch (error) {
            console.error('Error fetching chat history:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PDFController();