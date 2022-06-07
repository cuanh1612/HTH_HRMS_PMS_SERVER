"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const Client_1 = require("../entities/Client");
const Employee_1 = require("../entities/Employee");
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
        //join room project
        socket.on('joinRoomProject', (projectId) => {
            socket.join('roomProject' + projectId);
        });
        //leave room project
        socket.on('leaveRoomProject', (projectId) => {
            socket.leave('roomProject' + projectId);
        });
        //emit user join room project when have new discussion room
        socket.on('newProjectDiscussion', (projectId) => {
            socket.in('roomProject' + projectId).emit('getNewProjectDiscussion');
        });
        //join room project discussion
        socket.on('joinRoomProjectDiscussion', (projectDiscussionId) => {
            socket.join('roomProjectDiscussion' + projectDiscussionId);
        });
        //leave room project discussion
        socket.on('leaveRoomProjectDiscussison', (projectDiscussionId) => {
            socket.leave('roomProjectDiscussion' + projectDiscussionId);
        });
        //emit user join room project when have new discussion reply
        socket.on('newProjectDiscussionReply', (projectDiscussionId) => {
            socket
                .in('roomProjectDiscussion' + projectDiscussionId)
                .emit('getNewProjectDiscussionReply');
        });
        //join room project discussion
        socket.on('joinRoomProjectNote', (projectId) => {
            socket.join('roomProjectNote' + projectId);
        });
        //leave room project discussion
        socket.on('leaveRoomProjectNote', (projectId) => {
            socket.leave('roomProjectNote' + projectId);
        });
        //emit user join room project when have new discussion reply
        socket.on('newProjectNote', (projectId) => {
            socket.in('roomProjectNote' + projectId).emit('getNewProjectNote');
        });
        //join room task file
        socket.on('joinRoomTaskFile', (taskId) => {
            socket.join('roomTaskFile' + taskId);
        });
        //leave room task file
        socket.on('leaveRoomTaskFile', (taskId) => {
            socket.leave('roomTaskFile' + taskId);
        });
        //emit user join room task file when have new change task file
        socket.on('newTaskFile', (taskId) => {
            socket.in('roomTaskFile' + taskId).emit('getNewTaskFile');
        });
        //join room task comment
        socket.on('joinRoomTaskComment', (taskId) => {
            socket.join('roomTaskComment' + taskId);
        });
        //leave room task comment
        socket.on('leaveRoomTaskComment', (taskId) => {
            socket.leave('roomTaskComment' + taskId);
        });
        //emit user join room task comment when have new change task comment
        socket.on('newTaskComment', (taskId) => {
            socket.in('roomTaskComment' + taskId).emit('getNewTaskComment');
        });
        //join room project task
        socket.on('joinRoomProjectTask', (projectId) => {
            socket.join('roomProjectTask' + projectId);
        });
        //leave room project task
        socket.on('leaveRoomProjectTask', (projectId) => {
            socket.leave('roomProjectTask' + projectId);
        });
        //emit user join room project when have new task
        socket.on('newProjectTask', (projectId) => {
            socket.in('roomProjectTask' + projectId).emit('getNewProjectTask');
        });
        //join room project TimeLog
        socket.on('joinRoomProjectTimeLog', (projectId) => {
            socket.join('roomProjectTimeLog' + projectId);
        });
        //leave room project TimeLog
        socket.on('leaveRoomProjectTimeLog', (projectId) => {
            socket.leave('roomProjectTimeLog' + projectId);
        });
        //emit user join room project when have new TimeLog
        socket.on('newProjectTimeLog', (projectId) => {
            socket.in('roomProjectTimeLog' + projectId).emit('getNewProjectTimeLog');
        });
        //join room project TaskBoard
        socket.on('joinRoomProjectTaskBoard', (projectId) => {
            socket.join('roomProjectTaskBoard' + projectId);
        });
        //leave room project TaskBoard
        socket.on('leaveRoomProjectTaskBoard', (projectId) => {
            socket.leave('roomProjectTaskBoard' + projectId);
        });
        //emit user join room project when have new TaskBoard
        socket.on('newProjectTaskBoard', (projectId) => {
            socket.in('roomProjectTaskBoard' + projectId).emit('getNewProjectTaskBoard');
        });
        //emit user when admin created new noticeboard
        socket.on('newNoticeBoard', () => {
            io.emit('getNewNotifications');
        });
        //emit user when admin created new event
        socket.on('newEvent', () => {
            io.emit('getNewNotifications');
        });
        //emit user when assigned project
        socket.on('newProjectNotification', (clientId, employeeIds) => __awaiter(void 0, void 0, void 0, function* () {
            //get new notification for client
            //Get email client
            const existingClient = yield Client_1.Client.findOne({
                where: {
                    id: clientId,
                },
            });
            if (existingClient) {
                const clientSocket = onlineUsers.find((user) => {
                    return user.email === existingClient.email;
                });
                if (clientSocket === null || clientSocket === void 0 ? void 0 : clientSocket.socketId) {
                    socket.to(clientSocket.socketId).emit('getNewNotifications');
                }
            }
            //get new notification for employee
            yield Promise.all(employeeIds.map((employeeId) => __awaiter(void 0, void 0, void 0, function* () {
                //Get email employee
                const existingEmployee = yield Employee_1.Employee.findOne({
                    where: {
                        id: employeeId,
                    },
                });
                if (existingEmployee) {
                    const employeeSocket = onlineUsers.find((user) => {
                        return user.email === existingEmployee.email;
                    });
                    if (employeeSocket === null || employeeSocket === void 0 ? void 0 : employeeSocket.socketId) {
                        socket.to(employeeSocket.socketId).emit('getNewNotifications');
                    }
                }
            })));
        }));
        //emit user when assigned task
        socket.on('newTaskNotification', (employeeIds) => __awaiter(void 0, void 0, void 0, function* () {
            //get new notification for client
            //get new notification for employee
            yield Promise.all(employeeIds.map((employeeId) => __awaiter(void 0, void 0, void 0, function* () {
                //Get email employee
                const existingEmployee = yield Employee_1.Employee.findOne({
                    where: {
                        id: employeeId,
                    },
                });
                if (existingEmployee) {
                    const employeeSocket = onlineUsers.find((user) => {
                        return user.email === existingEmployee.email;
                    });
                    if (employeeSocket === null || employeeSocket === void 0 ? void 0 : employeeSocket.socketId) {
                        socket.to(employeeSocket.socketId).emit('getNewNotifications');
                    }
                }
            })));
        }));
        //emit user when assigned timelog
        socket.on('newTimeLogNotification', (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
            //get new notification for employee
            //Get email employee
            const existingEmployee = yield Employee_1.Employee.findOne({
                where: {
                    id: employeeId,
                },
            });
            if (existingEmployee) {
                const employeeSocket = onlineUsers.find((user) => {
                    return user.email === existingEmployee.email;
                });
                if (employeeSocket === null || employeeSocket === void 0 ? void 0 : employeeSocket.socketId) {
                    socket.to(employeeSocket.socketId).emit('getNewNotifications');
                }
            }
        }));
    });
};
exports.default = createSocketServer;
