const express=require('express');
const bodyParser = require("body-parser");
const app=express();
const multer=require('multer');
const cors=require('cors');
const port=process.env.PORT || 3000;
const {main,search,searchWithContext,storeinchroma,storechatHistory,getChatHistory}=require('./service/pdf.js');
const pdfRouter=require('./routes/pdfRoutes.js')
const userRouter=require('./routes/userroutes.js')
const connectDB=require('./db/db.js')
const huffmanRouter=require('./routes/huffmanroutes.js')
const dotenv=require('dotenv')

dotenv.config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const upload = multer();

app.use('/pdf',pdfRouter)
app.use('/users',userRouter)
app.use('/huffman',huffmanRouter)

app.listen(port,()=>console.log(`Server is running on port ${port}`));