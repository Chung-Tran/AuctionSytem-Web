// index.js

const express = require("express");
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dbConnect = require('./config/dbConnect');
const errorHandler = require('./middlewares/errorMiddleware');
const redisClient = require('./config/redis');
const cloudinary = require('cloudinary').v2;
const { initializeSocket } = require('./controllers/socket.controller');

// Tạo server http
const server = http.createServer(app);

// Khởi tạo Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3033",  // Thay đổi thành URL của client
        methods: ["GET", "POST"],
        credentials: true
    }
});
initializeSocket(io);

cloudinary.config({
    secure: true
});

// Connect db
dbConnect();

// Connect redis server in docker
redisClient.connect();

// Define routes
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const customerRoute = require("./routes/CustomerRoute");
const auctionRoute = require("./routes/auction.route");
const resourceRoute = require("./routes/resouce.rote");
const role = require('./routes/RoleRoute');

// Config server
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const corsOptions = {
    exposedHeaders: ['x-new-access-token', 'x-token-resetpassword'],
};
app.use(cors(corsOptions));

// Use routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use("/api/customers", customerRoute);
app.use("/api/auctions", auctionRoute);
app.use("/api/resource", resourceRoute)
app.use('/api/role', role);


// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server start in PORT ${PORT}`);
});