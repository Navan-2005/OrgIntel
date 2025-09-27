const dotenv=require('dotenv')
const express=require('express');
const bodyParser = require("body-parser");
dotenv.config();
const app=express();
const multer=require('multer');
const cors=require('cors');
const http=require('http');
const { Server } =require('socket.io');

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

const server =http.createServer(app);
const io=new Server(server,{
    cors: {
        origin: '*',
        // methods: ['GET', 'POST']
      }
});

// io.use(async (socket,next)=>{
//     try {
        
//         // const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[ 1 ];
//         const projectId = 'local';

//         // if(!mongoose.Types.ObjectId.isValid(projectId))
//         // {
//         //     return next(new Error('Invalid projectId'));
//         // }

//         // socket.project=await projectModel.findById(projectId);
//         // if(!token)
//         // {
//         //     return next(new Error('Authentication error'));
//         // }
//         // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
//         if(!decoded)
//         {
//             return next(new Error('Authentication error'));
//         }
//         console.log('User from Socket : ',decoded);
        
//         socket.user=decoded;
//         next();
//     } catch (error) {
//         console.log(error);  
//     }
// })

io.on('connection',socket=>{
    socket.roomId='local';

    console.log('a user connected');

    socket.join(socket.roomId);

    socket.on('project-message',async data=>{
        const message=data.message;
        console.log(data);
        const aiIsPresentInMessage = message.includes('@ai');
        socket.broadcast.to(socket.roomId).emit('project-message',data);
        if (aiIsPresentInMessage) {

            // const prompt = message.replace('@ai', '');

            // const result = await generateResult(prompt);

            io.to(socket.roomId).emit('project-message', {
                message: result,
                sender: {
                    _id: 'ai',
                    email: 'AI'
                }
            })
            return
        }
})
    socket.on('disconnect',()=>{

        console.log('a user disconnected');
        socket.leave(socket.roomId)
    });
    
})

server.listen(port,()=>console.log(`Server is running on port ${port}`));