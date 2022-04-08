"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const createSocketServer = (httpServer) => {
    let onlineUsers = [];
    const addNewUsre = ({ email, socketId }) => {
        !onlineUsers.some((user) => user.email === email) && onlineUsers.push({ email, socketId });
        console.log(onlineUsers);
    };
    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };
    // const getUser = (email: string) => {
    // 	return onlineUsers.find((user) => user.email === email)
    // }
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.URL_CLIENT,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        console.log('Someone has connected!');
        console.log(onlineUsers);
        socket.on('newUser', (email) => {
            addNewUsre({ email, socketId: socket.id });
        });
        socket.on('disconnect', () => {
            removeUser(socket.id);
        });
    });
};
exports.default = createSocketServer;
