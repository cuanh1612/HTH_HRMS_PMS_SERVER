import { Server } from 'http'
import { Server as ServerSocket } from 'socket.io'
import { userSocket } from '../type/SocketPayload'

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
			origin: process.env.URL_CLIENT,
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
			({ email, conversation }: { email: string; conversation: number }) => {
				const userReceive = getUser(email)

				if (userReceive) {
					socket.to(userReceive.socketId).emit('getNewReply', conversation)
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
	})
}

export default createSocketServer
