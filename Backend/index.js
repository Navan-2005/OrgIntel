const dotenv=require('dotenv')
const express=require('express');
const bodyParser = require("body-parser");
dotenv.config();
const app=express();
const multer=require('multer');
const cors=require('cors');
const port=process.env.PORT || 3000;
const {main,search,searchWithContext,storeinchroma,storechatHistory,getChatHistory}=require('./service/pdf.js');
const pdfRouter=require('./routes/pdfRoutes.js')
const userRouter=require('./routes/userroutes.js')
const mcprouter=require('./routes/mcproutes.js')
const connectDB=require('./db/db.js')

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const upload = multer();

app.use('/pdf',pdfRouter)
app.use('/users',userRouter)
app.use('/mcp',mcprouter)

app.listen(port,()=>console.log(`Server is running on port ${port}`));