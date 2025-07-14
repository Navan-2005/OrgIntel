const fs=require('fs');
const pdfParse = require('pdf-parse');
const {ChromaClient} = require('chromadb');
const {GoogleGenerativeAI} = require('@google/generative-ai');
const dotenv = require('dotenv');
const {RecursiveCharacterTextSplitter} =require('langchain/text_splitter');

dotenv.config();

const ai= new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const Chromaclient=new ChromaClient({
    host:'localhost',
    posrt:8000,
    ssl:false
})

Chromaclient.heartbeat().then(()=>{
    console.log("✅ Connected to ChromaDB");
})

const init=async()=>{
    const collection=await Chromaclient.getOrCreateCollection({
        name:"pdfs",
        embeddingFunction:null
    })
    return collection;
}

const initChatHistory=async()=>{
    const collection=await Chromaclient.getOrCreateCollection({
        name:"chat_history",
        embeddingFunction:null
    })
    return collection;
}

const generateembedding=async(text)=>{
    const model=ai.getGenerativeModel({model:"text-embedding-004"});
    const res=await model.embedContent(text);
    return res.embedding.values;
}

const txtfrompdf=async(filebuffer)=>{
    const data=await pdfParse(filebuffer);
    return data.text;
}

const chunktext=async(text)=>{
    const splitter=new RecursiveCharacterTextSplitter({
        chunkSize:1000,
        chunkOverlap:200
    });
    const docs=await splitter.createDocuments([text]);
    return docs.map((doc)=>doc.pageContent);
}

const storeinchroma=async(chunks,fieldId='pdf')=>{
    const collection=await init();
    for(let i=0;i<chunks.length;i++)
    {
        const embedding=await generateembedding(chunks[i]);
        await collection.add({
            ids:[`${fieldId}-${i}`],
            embeddings:[embedding],
            documents:[chunks[i]],
            metadatas:[{fieldId}]
        })
    }
    console.log("✅ PDF stored in ChromaDB");
}

const storechatHistory=async(sessionId,question,answer)=>{
    const collection = await initChatHistory();
    const chatText = `Q: ${question}\nA: ${answer}`;
    const embedding = await generateembedding(chatText);
    const timestamp = new Date().toISOString();
    
    await collection.add({
        ids: [`${sessionId}-${Date.now()}`],
        embeddings: [embedding],
        documents: [chatText],
        metadatas: [{ 
            sessionId, 
            question, 
            answer, 
            timestamp,
            type: 'chat'
        }],
    });
    console.log('✅ Chat history stored');
}
    const getChatHistory = async (sessionId, limit = 10) => {
    try {
        const collection = await initChatHistory();
        const results = await collection.get({
            where: { sessionId },
            limit
        });
        
        if (!results.documents || results.documents.length === 0) {
            return [];
        }
        
        // Sort by timestamp and return recent conversations
        const conversations = results.metadatas.map((meta, index) => ({
            question: meta.question,
            answer: meta.answer,
            timestamp: meta.timestamp
        })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        return conversations.slice(0, limit);
    } catch (error) {
        console.log('No chat history found for session:', sessionId);
        return [];
    }
};

const searchWithContext = async (query, sessionId, topk = 3) => {
    const collection = await init();
    const embedding = await generateembedding(query);
    const results = await collection.query({
        queryEmbeddings: [embedding],
        nResults: topk,
    });
    
    // Get recent chat history for context
    const chatHistory = await getChatHistory(sessionId, 5);
    
    return {
        documents: results.documents[0],
        chatHistory
    };
};

const search = async (query, topk = 3) => {
    const collection = await init();
    const embedding = await generateembedding(query);
    const results = await collection.query({
        queryEmbeddings: [embedding],
        nResults: topk,
    });
    return results.documents[0];
};

const main = async (filepath, question, fileId) => {
    const text = await txtfrompdf(filepath);
    const chunks = await chunktext(text);
    await storeinchroma(chunks, fileId);
};


module.exports={
    main,search,searchWithContext,storeinchroma,storechatHistory,getChatHistory
}