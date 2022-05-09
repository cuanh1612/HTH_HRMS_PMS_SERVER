import { Request, Response } from 'express'
import { Conversation } from '../entities/Conversation'
import { Conversation_reply } from '../entities/Conversation_Reply'
import { Employee } from '../entities/Employee'
import { createOrUpdateConversationReplyPayload } from '../type/ConversationReplyPayload'
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

		return res.status(200).json({
			code: 200,
			success: true,
			conversationReply: createdConversationReply,
			message: 'Created new conversation reply successfully',
		})
	}),

	getByConversation: handleCatchError(async (req: Request, res: Response) => {
		const { conversationId } = req.params

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

		return res.status(200).json({
			code: 200,
			success: true,
			replies,
			message: 'Get replies by conversation successfully',
		})
	}),
}

export default conversationReplyController
