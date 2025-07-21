# DocuMind

> An AI-powered, collaborative document assistant that lets users summarize, chat with, annotate, and study documents 
---

## 🔥 Live Features

- 🧠 **AI-Powered Summarization** – Extract concise summaries from long documents
- 💬 **Chat with Your Document** – Ask questions in real-time based on document content
- 🗂️ **Multiple PDF Uploads** – Cross-document chat, memory search
- 🗣️ **Voice Chat (Whisper + Gemini)** – Speak queries directly
- 🔐 **User Authentication** – Secure login and sessions
- 📚 **Personal Knowledge Base** – Save and search across all uploads
- 🧩 **Vector Database (Chroma/FAISS)** – For semantic memory and document embedding
- 📦 **Compressed Notes (Huffman/Brotli)** – Reduce storage size
- 🧪 **Experimental AI Assistant** – Live tutor within your PDFs

---

## 🚀 Future Enhancements

- ✅ OCR for images and scanned PDFs
- ✅ Voice-guided document reading (TTS)
- ✅ Smart flashcard generation
- ✅ Export mind maps to Notion/Markdown
- ✅ Offline PDF summarization using WASM
- ✅ Grammarly-style AI suggestions

  ## 🛠️ Tech Stack

### 🌐 Frontend

- **React.js ** (App Router)
- **Tailwind CSS** + **Shadcn UI**
- `react-pdf` for viewing PDFs
- `React Flow` for mind maps
- `react-speech-recognition` for voice input
- `Socket.IO` for live collaboration

### 🧠 AI & NLP

- Google Gemini for summarization & QA
- LangChain  document agents
- Whisper for speech-to-text
- Embedding generation via Gemini
- Vector DB: **Chroma**

### ⚙️ Backend

-  **Node.js** (Express)
- PDF processing via `pdf-parser` 

### 🗃️ Storage

- Vector store (ChromaDB )
- Document & user storage: MongoDB 

---

## 📦 Compression (Advanced)

- Huffman Coding (educational)

