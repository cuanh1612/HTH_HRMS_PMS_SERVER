"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const createSocketServer = (httpServer) => {
    let onlineUsers = [];
    const addNewUsre = ({ email, socketId }) => {
        !onlineUsers.some((user) => user.email === email) && onlineUsers.push({ email, socketId });
    };
    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };
    const getUser = (email) => {
        return onlineUsers.find((user) => user.email === email);
    };
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.URL_CLIENT,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        socket.on('newUser', (email) => {
            addNewUsre({ email, socketId: socket.id });
        });
        socket.on('disconnect', () => {
            removeUser(socket.id);
        });
        socket.on('newReply', ({ email, conversation }) => {
            const userReceive = getUser(email);
            if (userReceive) {
                socket.to(userReceive.socketId).emit('getNewReply', conversation);
            }
        });
        //join room discussion contract
        socket.on('joinRoomDiscussionContract', (contractId) => {
            socket.join('roomDiscussionContract' + contractId);
        });
        //leave room discussion contract
        socket.on('leaveRoomDiscussionContract', (contractId) => {
            socket.leave('roomDiscussionContract' + contractId);
        });
        //emit user join room discussion contract when have new change comment
        socket.on('newDiscussion', (contractId) => {
            socket.in('roomDiscussionContract' + contractId).emit('getNewDiscussion');
        });
        //join room file contract
        socket.on('joinRoomFileContract', (contractId) => {
            socket.join('roomFileContract' + contractId);
        });
        //leave room file contract
        socket.on('leaveRoomFileContract', (contractId) => {
            socket.leave('roomFileContract' + contractId);
        });
        //emit user join room file contract when have new change file
        socket.on('newFile', (contractId) => {
            socket.in('roomFileContract' + contractId).emit('getNewFileContract');
        });
        //join room file project
        socket.on('joinRoomFileProject', (projectId) => {
            socket.join('roomFileProject' + projectId);
        });
        //leave room file project
        socket.on('leaveRoomFileProject', (projectId) => {
            socket.leave('roomFileProject' + projectId);
        });
        //emit user join room file project when have new change file
        socket.on('newFileProject', (projectId) => {
            socket.in('roomFileProject' + projectId).emit('getNewFileProject');
        });
    });
};
exports.default = createSocketServer;
