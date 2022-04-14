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
	})
}

export default createSocketServer
