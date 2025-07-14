const express = require('express');
const multer = require('multer');
const pdfController = require('../controller/pdfController');

const router = express.Router();
const upload = multer();

// PDF processing route
router.post('/upload', upload.array('pdfs'), pdfController.processPDFs);

// Chat endpoint with context
router.post('/chat', pdfController.chat);

// Get chat history for a session
router.get('/chat-history/:sessionId', pdfController.getChatHistory);

module.exports = router;