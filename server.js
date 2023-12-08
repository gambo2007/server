// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:7456'); // Thay thế URL của máy chủ Cocos Creator của bạn
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    const socketId = socket.id;

    socket.on('gameData', (userData) => {
        console.log(JSON.stringify(userData) +`${socketId} connected`);
    });

    socket.on('messageData', (data) => {
        console.log(`Received message data from ${socket.id}:`, data.message);

        io.emit('messageData', {
            username: data.nameUser,
            avatar:data.avatar,
            message: data.message,
            socketID: data.socketID,
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
