//Khởi tạo biến config
const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const dbConnect = require('./config/dbConnect');
// const { connectRedis, addUserOnlineToList } = require('./config/redisConfig'); 
const cloudinary = require('cloudinary').v2;
// const {wss,userConnection} = require('./config/webSocketConfig');


cloudinary.config({
    secure: true
});
//Connect db
dbConnect();
// Connect redis server in docker
const redisClient = connectRedis();
redisClient.connect();
//config websocket
wss.on('connection', function connection(ws) {
    userConnection.add(ws);
    // Xử lý các tin nhắn nhận được từ client
    ws.on('message', function incoming(message) {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === 'chat') {
                // Tin nhắn là loại chat, gọi hàm sendMessage để xử lý
                sendMessage(parsedMessage,userConnection);
            }
            
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

});

//Define routes


//Config server
app.use(cookieParser()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

//Middleware authen token


//Use routes


//Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server start in PORT ${PORT}`)
})


