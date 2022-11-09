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
const Client_entity_1 = require("../entities/Client.entity");
const Employee_entity_1 = require("../entities/Employee.entity");
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
            // 'https://huprom-hrms-pms-client.vercel.app'
            origin: '*'
        },
    });
    io.on('connection', (socket) => {
        socket.on('newUser', (email) => {
            addNewUsre({ email, socketId: socket.id });
        });
        socket.on('disconnect', () => {
            removeUser(socket.id);
        });
        socket.on('newReply', ({ email, conversation, newReplies }) => {
            const userReceive = getUser(email);
            if (userReceive) {
                socket.to(userReceive.socketId).emit('getNewReply', conversation, newReplies);
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
            const existingClient = yield Client_entity_1.Client.findOne({
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
                const existingEmployee = yield Employee_entity_1.Employee.findOne({
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
                const existingEmployee = yield Employee_entity_1.Employee.findOne({
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
        //emit client when assigned contract
        socket.on('newContractNotification', (clientId) => __awaiter(void 0, void 0, void 0, function* () {
            //get new notification for client
            //Get email client
            const existingClient = yield Client_entity_1.Client.findOne({
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
        }));
        //emit user when assigned timelog
        socket.on('newTimeLogNotification', (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
            //get new notification for employee
            //Get email employee
            const existingEmployee = yield Employee_entity_1.Employee.findOne({
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
        //join room Task
        socket.on('joinRoomTask', () => {
            socket.join('roomTask');
        });
        //leave room project TaskBoard
        socket.on('leaveRoomTask', () => {
            socket.leave('roomTask');
        });
        //emit user join room project when have new TaskBoard
        socket.on('newTask', () => {
            socket.in('roomTask').emit('getNewTask');
        });
        //join room TimeLog
        socket.on('joinRoomTimeLog', () => {
            socket.join('roomTimeLog');
        });
        //leave room project TimeLog
        socket.on('leaveRoomTimeLog', () => {
            socket.leave('roomTimeLog');
        });
        //emit user join room project when have new TimeLog
        socket.on('newTimeLog', () => {
            socket.in('roomTimeLog').emit('getNewTimeLog');
        });
        //join room Event
        socket.on('joinRoomEvent', () => {
            socket.join('roomEvent');
        });
        //leave room project Event
        socket.on('leaveRoomEvent', () => {
            socket.leave('roomEvent');
        });
        //emit user join room project when have new Event
        socket.on('newEvent', () => {
            socket.in('roomEvent').emit('getNewEvent');
        });
        //join room NoticeBoard
        socket.on('joinRoomNoticeBoard', () => {
            socket.join('roomNoticeBoard');
        });
        //leave room project NoticeBoard
        socket.on('leaveRoomNoticeBoard', () => {
            socket.leave('roomNoticeBoard');
        });
        //emit user join room project when have new NoticeBoard
        socket.on('newNoticeBoard', () => {
            socket.in('roomNoticeBoard').emit('getNewNoticeBoard');
        });
        //join room member project
        socket.on('joinRoomMemberProject', (projectId) => {
            socket.join('roomMemberProject' + projectId);
        });
        //leave room member project
        socket.on('leaveRoomMemberProject', (projectId) => {
            socket.leave('roomMemberProject' + projectId);
        });
        //emit user join room member project when have new change member
        socket.on('newMemberProject', (projectId) => {
            socket.in('roomMemberProject' + projectId).emit('getNewMemberProject');
        });
        //join room interview file
        socket.on('joinRoomInterviewFile', (interviewId) => {
            socket.join('roomInterviewFile' + interviewId);
        });
        //leave room interview file
        socket.on('leaveRoomInterviewFile', (interviewId) => {
            socket.leave('roomInterviewFile' + interviewId);
        });
        //emit user join room interview file when have new change interview file
        socket.on('newInterviewFile', (interviewId) => {
            socket.in('roomInterviewFile' + interviewId).emit('getNewInterviewFile');
        });
        //join room job application file
        socket.on('joinRoomJobApplicationFile', (jobApplicationId) => {
            socket.join('roomJobApplicationFile' + jobApplicationId);
        });
        //leave room job application file
        socket.on('leaveRoomJobApplicationFile', (jobApplicationId) => {
            socket.leave('roomJobApplicationFile' + jobApplicationId);
        });
        //emit user join room job application file when have new change job application file
        socket.on('newJobApplicationFile', (jobApplicationId) => {
            socket.in('roomJobApplicationFile' + jobApplicationId).emit('getNewJobApplicationFile');
        });
    });
};
exports.default = createSocketServer;
