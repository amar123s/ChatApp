import "dotenv/config";
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import jwt from "jsonwebtoken";
import { connectDB } from './config/db.js';
import { mesmodel } from './messge/messageschema.js';
import authrouter,{JWT} from './routes/routes.js';

const onlineUsers = {};
const userSocket={};
const app = express();
const PORT=process.env.PORT

const allowedorigin=['http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500'];

app.use(express.json());
app.use(cors({
    origin:allowedorigin,
    methods:["GET","POST"]
}));

app.use("/api",authrouter);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin:allowedorigin,
        methods: ["GET", "POST"]
    }
});

io.use((socket,next)=>{
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if(!token)return next(new Error("No token provided"));
    try{
        const decode= jwt.verify(token,JWT);
        socket.username=decode.username;
        socket.avatar=decode.avatar;
        next();
    }catch(err){
        next(new Error("Invalid or expired token"))
    }
});

io.on('connection', (socket) => {
    console.log("Connection is established");

    onlineUsers[socket.id] = { username: socket.username, avatar: socket.avatar };
    userSocket[socket.username] = socket.id;

    io.emit("online_users",Object.values(onlineUsers));

    function sendGrouphistroy(){
        mesmodel.find({to:null}).sort({timestamp:1}).limit(50)
        .then(messages=>{socket.emit('load_messages',messages);
        }).catch(err=>{console.log(err);

        });
    }

    sendGrouphistroy();
    socket.on("get_messages",sendGrouphistroy)


   socket.on('new_message', (message) => {

    const userMessage = {
        username: socket.username,
        avatar: socket.avatar,
        message: message,
        to:null,
        timestamp: new Date()
    };

    const newChat = new mesmodel(userMessage);

    newChat.save();

    io.emit('broadcast_message', userMessage);

});

socket.on("open_dm",(withUser)=>{
    const me = socket.username;

    mesmodel.find({
        $or:[ { username: me, to: withUser },{ username: withUser, to: me }]
    }).sort({timestamp:1}).limit(50).then(messages=>{
        socket.emit("load_dm_messages",{withUser,messages});
    }).catch(err=>console.log(err));
});

socket.on("private_message",({to,message})=>{
    const userMessage={
        username:socket.username,
        avatar:socket.avatar,
        message:message,
        to:to,
        timestamp:new Date()
    };
    new mesmodel(userMessage).save();
    const recipientSocketId=userSocket[to];
    if(recipientSocketId){
        io.to(recipientSocketId).emit('private_message',userMessage);
    }
    socket.emit("private_message",userMessage)
});


    socket.on("typing", (username) => {
    socket.broadcast.emit("typing", username);
});

    socket.on('disconnect', () => {
        if (socket.username)delete userSocket[socket.username];
        delete onlineUsers[socket.id];
        io.emit("online_users", Object.values(onlineUsers));
        console.log("Connection is disconnected");
    })
});

server.listen(PORT, () => {
    console.log(`Server is live on ${PORT}`);
    connectDB();
})
