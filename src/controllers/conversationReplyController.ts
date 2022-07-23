import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { getManager } from 'typeorm'
import { Conversation } from '../entities/Conversation'
import { Conversation_reply } from '../entities/Conversation_Reply'
import { Employee } from '../entities/Employee'
import { createOrUpdateConversationReplyPayload } from '../type/ConversationReplyPayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'

const conversationReplyController = {
	//Create new conversation reply
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewConversationReply: createOrUpdateConversationReplyPayload = req.body
		const { user, conversation } = dataNewConversationReply

		//check user exists
		const existingUser = await Employee.findOne({
			where: {
				id: user,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		//Check conversation exist
		const existingConversation = await Conversation.findOne({
			where: {
				id: conversation,
			},
		})

		if (!existingConversation)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Conversation does not exist in the system',
			})

		//Check user exist in the conversation
		if (!existingConversation.employees.some((employee) => employee.id === existingUser.id))
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the conversation',
			})

		const createdConversationReply = await Conversation_reply.create({
			...dataNewConversationReply,
		}).save()

		const reply = await Conversation_reply.findOne({
			where: {
				id: createdConversationReply.id
			},
			relations: {
				user: true
			}
		})
		return res.status(200).json({
			code: 200,
			success: true,
			reply,
			message: 'Created new conversation reply successfully',
		})
	}),

	getByConversation: handleCatchError(async (req: Request, res: Response) => {
		const { conversationId } = req.params

		//check exist current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		const existingUser = await Employee.findOne({
			where: {
				id: decode.userId,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		//Check exist conversation
		const existingConversation = await Conversation.findOne({
			where: {
				id: Number(conversationId),
			},
		})

		if (!existingConversation)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the conversation',
			})

		//Get replies by conversation
		const replies = await Conversation_reply.find({
			where: {
				conversation: { id: existingConversation.id },
			},
			order: {
				createdAt: 'ASC',
			},
		})

		//get messages not read and update already read
		const manager = getManager('huprom')
		const messagesNotRead: Conversation_reply[] = await manager.query(
			`SELECT * FROM "conversation_reply" WHERE "conversation_reply"."conversationId" = ${existingConversation.id} AND "conversation_reply"."userId" != ${existingUser.id} AND "conversation_reply"."read" = FALSE`
		)

		//Update
		await Promise.all(messagesNotRead.map(conversationReply => {
			return new Promise(async resolve => {
				await Conversation_reply.update(conversationReply.id, {
					read: true
				})
				resolve(true)
			})
		}))

		return res.status(200).json({
			code: 200,
			success: true,
			replies,
			message: 'Get replies by conversation successfully',
		})
	}),
}

export default conversationReplyController
