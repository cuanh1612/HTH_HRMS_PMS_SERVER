import { Server } from 'http'
import { Server as ServerSocket } from 'socket.io'
import { Client } from '../entities/Client.entity'
import { Conversation_reply } from '../entities/Conversation_Reply.entity'
import { Employee } from '../entities/Employee.entity'
import { userSocket } from '../type/SocketPayload'
require('dotenv').config()

const createSocketServer = (httpServer: Server) => {
	let onlineUsers: userSocket[] = []

	const addNewUsre = ({ email, socketId }: userSocket) => {
		!onlineUsers.some((user) => user.email === email) && onlineUsers.push({ email, socketId })
	}

	const removeUser = (socketId: string) => {
		onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
	}

	const getUser = (email: string) => {
		return onlineUsers.find((user) => user.email === email)
	}

	const io = new ServerSocket(httpServer, {
		cors: {
			// 'https://huprom-hrms-pms-client.vercel.app'
			origin: `${process.env.CLIENT_URL}`,
			methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
			credentials: true,
		},
	})

	io.on('connection', (socket) => {
		socket.on('newUser', (email: string) => {
			addNewUsre({ email, socketId: socket.id })
		})

		socket.on('disconnect', () => {
			removeUser(socket.id)
		})

		socket.on(
			'newReply',
			({ email, conversation, newReplies }: { email: string; conversation: number, newReplies: Conversation_reply[] }) => {
				const userReceive = getUser(email)

				if (userReceive) {
					socket.to(userReceive.socketId).emit('getNewReply', conversation, newReplies)
				}
			}
		)

		//join room discussion contract
		socket.on('joinRoomDiscussionContract', (contractId: string) => {
			socket.join('roomDiscussionContract' + contractId)
		})

		//leave room discussion contract
		socket.on('leaveRoomDiscussionContract', (contractId: string) => {
			socket.leave('roomDiscussionContract' + contractId)
		})

		//emit user join room discussion contract when have new change comment
		socket.on('newDiscussion', (contractId: string) => {
			socket.in('roomDiscussionContract' + contractId).emit('getNewDiscussion')
		})

		//join room file contract
		socket.on('joinRoomFileContract', (contractId: string) => {
			socket.join('roomFileContract' + contractId)
		})

		//leave room file contract
		socket.on('leaveRoomFileContract', (contractId: string) => {
			socket.leave('roomFileContract' + contractId)
		})

		//emit user join room file contract when have new change file
		socket.on('newFile', (contractId: string) => {
			socket.in('roomFileContract' + contractId).emit('getNewFileContract')
		})

		//join room file project
		socket.on('joinRoomFileProject', (projectId: string) => {
			socket.join('roomFileProject' + projectId)
		})

		//leave room file project
		socket.on('leaveRoomFileProject', (projectId: string) => {
			socket.leave('roomFileProject' + projectId)
		})

		//emit user join room file project when have new change file
		socket.on('newFileProject', (projectId: string) => {
			socket.in('roomFileProject' + projectId).emit('getNewFileProject')
		})

		//join room project
		socket.on('joinRoomProject', (projectId: string) => {
			socket.join('roomProject' + projectId)
		})

		//leave room project
		socket.on('leaveRoomProject', (projectId: string) => {
			socket.leave('roomProject' + projectId)
		})

		//emit user join room project when have new discussion room
		socket.on('newProjectDiscussion', (projectId: string) => {
			socket.in('roomProject' + projectId).emit('getNewProjectDiscussion')
		})

		//join room project discussion
		socket.on('joinRoomProjectDiscussion', (projectDiscussionId: string | number) => {
			socket.join('roomProjectDiscussion' + projectDiscussionId)
		})

		//leave room project discussion
		socket.on('leaveRoomProjectDiscussison', (projectDiscussionId: string | number) => {
			socket.leave('roomProjectDiscussion' + projectDiscussionId)
		})

		//emit user join room project when have new discussion reply
		socket.on('newProjectDiscussionReply', (projectDiscussionId: string | number) => {
			socket
				.in('roomProjectDiscussion' + projectDiscussionId)
				.emit('getNewProjectDiscussionReply')
		})

		//join room project discussion
		socket.on('joinRoomProjectNote', (projectId: string | number) => {
			socket.join('roomProjectNote' + projectId)
		})

		//leave room project discussion
		socket.on('leaveRoomProjectNote', (projectId: string | number) => {
			socket.leave('roomProjectNote' + projectId)
		})

		//emit user join room project when have new discussion reply
		socket.on('newProjectNote', (projectId: string | number) => {
			socket.in('roomProjectNote' + projectId).emit('getNewProjectNote')
		})

		//join room task file
		socket.on('joinRoomTaskFile', (taskId: string) => {
			socket.join('roomTaskFile' + taskId)
		})

		//leave room task file
		socket.on('leaveRoomTaskFile', (taskId: string) => {
			socket.leave('roomTaskFile' + taskId)
		})

		//emit user join room task file when have new change task file
		socket.on('newTaskFile', (taskId: string) => {
			socket.in('roomTaskFile' + taskId).emit('getNewTaskFile')
		})

		//join room task comment
		socket.on('joinRoomTaskComment', (taskId: string) => {
			socket.join('roomTaskComment' + taskId)
		})

		//leave room task comment
		socket.on('leaveRoomTaskComment', (taskId: string) => {
			socket.leave('roomTaskComment' + taskId)
		})

		//emit user join room task comment when have new change task comment
		socket.on('newTaskComment', (taskId: string) => {
			socket.in('roomTaskComment' + taskId).emit('getNewTaskComment')
		})

		//join room project task
		socket.on('joinRoomProjectTask', (projectId: string | number) => {
			socket.join('roomProjectTask' + projectId)
		})

		//leave room project task
		socket.on('leaveRoomProjectTask', (projectId: string | number) => {
			socket.leave('roomProjectTask' + projectId)
		})

		//emit user join room project when have new task
		socket.on('newProjectTask', (projectId: string | number) => {
			socket.in('roomProjectTask' + projectId).emit('getNewProjectTask')
		})

		//join room project TimeLog
		socket.on('joinRoomProjectTimeLog', (projectId: string | number) => {
			socket.join('roomProjectTimeLog' + projectId)
		})

		//leave room project TimeLog
		socket.on('leaveRoomProjectTimeLog', (projectId: string | number) => {
			socket.leave('roomProjectTimeLog' + projectId)
		})

		//emit user join room project when have new TimeLog
		socket.on('newProjectTimeLog', (projectId: string | number) => {
			socket.in('roomProjectTimeLog' + projectId).emit('getNewProjectTimeLog')
		})

		//join room project TaskBoard
		socket.on('joinRoomProjectTaskBoard', (projectId: string | number) => {
			socket.join('roomProjectTaskBoard' + projectId)
		})

		//leave room project TaskBoard
		socket.on('leaveRoomProjectTaskBoard', (projectId: string | number) => {
			socket.leave('roomProjectTaskBoard' + projectId)
		})

		//emit user join room project when have new TaskBoard
		socket.on('newProjectTaskBoard', (projectId: string | number) => {
			socket.in('roomProjectTaskBoard' + projectId).emit('getNewProjectTaskBoard')
		})

		//emit user when admin created new noticeboard
		socket.on('newNoticeBoard', () => {
			io.emit('getNewNotifications')
		})

		//emit user when admin created new event
		socket.on('newEvent', () => {
			io.emit('getNewNotifications')
		})

		//emit user when assigned project
		socket.on('newProjectNotification', async (clientId: number, employeeIds: number[]) => {
			//get new notification for client
			//Get email client
			const existingClient = await Client.findOne({
				where: {
					id: clientId,
				},
			})

			if (existingClient) {
				const clientSocket = onlineUsers.find((user) => {
					return user.email === existingClient.email
				})

				if (clientSocket?.socketId) {
					socket.to(clientSocket.socketId).emit('getNewNotifications')
				}
			}

			//get new notification for employee
			await Promise.all(
				employeeIds.map(async (employeeId) => {
					//Get email employee
					const existingEmployee = await Employee.findOne({
						where: {
							id: employeeId,
						},
					})

					if (existingEmployee) {
						const employeeSocket = onlineUsers.find((user) => {
							return user.email === existingEmployee.email
						})

						if (employeeSocket?.socketId) {
							socket.to(employeeSocket.socketId).emit('getNewNotifications')
						}
					}
				})
			)
		})

		//emit user when assigned task
		socket.on('newTaskNotification', async (employeeIds: number[]) => {
			//get new notification for client
			//get new notification for employee
			await Promise.all(
				employeeIds.map(async (employeeId) => {
					//Get email employee
					const existingEmployee = await Employee.findOne({
						where: {
							id: employeeId,
						},
					})

					if (existingEmployee) {
						const employeeSocket = onlineUsers.find((user) => {
							return user.email === existingEmployee.email
						})

						if (employeeSocket?.socketId) {
							socket.to(employeeSocket.socketId).emit('getNewNotifications')
						}
					}
				})
			)
		})

		//emit client when assigned contract
		socket.on('newContractNotification', async (clientId: number) => {
			//get new notification for client
			//Get email client
			const existingClient = await Client.findOne({
				where: {
					id: clientId,
				},
			})

			if (existingClient) {
				const clientSocket = onlineUsers.find((user) => {
					return user.email === existingClient.email
				})

				if (clientSocket?.socketId) {
					socket.to(clientSocket.socketId).emit('getNewNotifications')
				}
			}
		})

		//emit user when assigned timelog
		socket.on('newTimeLogNotification', async (employeeId: number) => {
			//get new notification for employee

			//Get email employee
			const existingEmployee = await Employee.findOne({
				where: {
					id: employeeId,
				},
			})

			if (existingEmployee) {
				const employeeSocket = onlineUsers.find((user) => {
					return user.email === existingEmployee.email
				})

				if (employeeSocket?.socketId) {
					socket.to(employeeSocket.socketId).emit('getNewNotifications')
				}
			}
		})

		//join room Task
		socket.on('joinRoomTask', () => {
			socket.join('roomTask')
		})

		//leave room project TaskBoard
		socket.on('leaveRoomTask', () => {
			socket.leave('roomTask')
		})

		//emit user join room project when have new TaskBoard
		socket.on('newTask', () => {
			socket.in('roomTask').emit('getNewTask')
		})

		//join room TimeLog
		socket.on('joinRoomTimeLog', () => {
			socket.join('roomTimeLog')
		})

		//leave room project TimeLog
		socket.on('leaveRoomTimeLog', () => {
			socket.leave('roomTimeLog')
		})

		//emit user join room project when have new TimeLog
		socket.on('newTimeLog', () => {
			socket.in('roomTimeLog').emit('getNewTimeLog')
		})

		//join room Event
		socket.on('joinRoomEvent', () => {
			socket.join('roomEvent')
		})

		//leave room project Event
		socket.on('leaveRoomEvent', () => {
			socket.leave('roomEvent')
		})

		//emit user join room project when have new Event
		socket.on('newEvent', () => {
			socket.in('roomEvent').emit('getNewEvent')
		})

		//join room NoticeBoard
		socket.on('joinRoomNoticeBoard', () => {
			socket.join('roomNoticeBoard')
		})

		//leave room project NoticeBoard
		socket.on('leaveRoomNoticeBoard', () => {
			socket.leave('roomNoticeBoard')
		})

		//emit user join room project when have new NoticeBoard
		socket.on('newNoticeBoard', () => {
			socket.in('roomNoticeBoard').emit('getNewNoticeBoard')
		})

		//join room member project
		socket.on('joinRoomMemberProject', (projectId: string) => {
			socket.join('roomMemberProject' + projectId)
		})

		//leave room member project
		socket.on('leaveRoomMemberProject', (projectId: string) => {
			socket.leave('roomMemberProject' + projectId)
		})

		//emit user join room member project when have new change member
		socket.on('newMemberProject', (projectId: string) => {
			socket.in('roomMemberProject' + projectId).emit('getNewMemberProject')
		})

		//join room interview file
		socket.on('joinRoomInterviewFile', (interviewId: string) => {
			socket.join('roomInterviewFile' + interviewId)
		})

		//leave room interview file
		socket.on('leaveRoomInterviewFile', (interviewId: string) => {
			socket.leave('roomInterviewFile' + interviewId)
		})

		//emit user join room interview file when have new change interview file
		socket.on('newInterviewFile', (interviewId: string) => {
			socket.in('roomInterviewFile' + interviewId).emit('getNewInterviewFile')
		})

		//join room job application file
		socket.on('joinRoomJobApplicationFile', (jobApplicationId: string) => {
			socket.join('roomJobApplicationFile' + jobApplicationId)
		})

		//leave room job application file
		socket.on('leaveRoomJobApplicationFile', (jobApplicationId: string) => {
			socket.leave('roomJobApplicationFile' + jobApplicationId)
		})

		//emit user join room job application file when have new change job application file
		socket.on('newJobApplicationFile', (jobApplicationId: string) => {
			socket.in('roomJobApplicationFile' + jobApplicationId).emit('getNewJobApplicationFile')
		})
	})
}

export default createSocketServer
