const express=require('express');
const app=express();
const multer=require('multer');
const cors=require('cors');
const port=process.env.PORT || 3000;
const {main,search,searchWithContext,storeinchroma,storechatHistory,getChatHistory}=require('./service/pdf.js');
const pdfRouter=require('./routes/pdfRoutes.js')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const upload = multer();

app.use('/pdf',pdfRouter)


app.listen(port,()=>console.log(`Server is running on port ${port}`));