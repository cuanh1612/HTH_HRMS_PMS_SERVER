import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { getManager } from 'typeorm'
import { Conversation } from '../entities/Conversation'
import { Employee } from '../entities/Employee'
import { createOrUpdateConversationPayload } from '../type/ConversationPayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'

const conversationController = {
	//Create new conversation
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewConversation: createOrUpdateConversationPayload = req.body
		const { user_one, user_two } = dataNewConversation

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

		//Check same user
		if (user_one === user_two)
			return res.status(400).json({
				code: 400,
				success: false,
				message: "You can't create a conversation with yourself",
			})

		//check user exists
		const existingUserOne = await Employee.findOne({
			where: {
				id: user_one,
			},
		})

		const existingUserTwo = await Employee.findOne({
			where: {
				id: user_two,
			},
		})

		if (!existingUserOne || !existingUserTwo)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		//Check employee assign conversation
		const conversations = await Conversation.find({
			relations: {
				employees: true,
			},
			where: {
				employees: [{ id: existingUserOne.id }],
			},
		})

		let isExistConversation = false
		for (let index = 0; index < conversations.length; index++) {
			const conversation = conversations[index]
			if (conversation.employees.some((employee) => employee.id === existingUserTwo.id)) {
				isExistConversation = true
				break
			}
		}

		if (isExistConversation)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Conversation already exist in the system',
			})

		//Create new conversation
		const createdConversation = await Conversation.create({
			employees: [existingUserOne, existingUserTwo],
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			conversation: createdConversation,
			message: 'Created new conversation successfully',
		})
	}),

	getByUser: handleCatchError(async (req: Request, res: Response) => {
		const { userId } = req.params

		//Check exist userId
		const existingUser = await Employee.findOne({
			where: {
				id: Number(userId),
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		//Get all conversations of employee
		const conversations = await Conversation.find({
			where: {
				employees: [{ id: existingUser.id }],
			},
		})

		//Get latest message and count messages not read
		const manager = getManager('huprom')

		let overrideConversations: any[] = []

		for (let index = 0; index < conversations.length; index++) {
			const ConversationElement = conversations[index]

			//get latest message
			const lastestMessager = await manager.query(
				`SELECT * FROM "conversation_reply" WHERE "conversation_reply"."conversationId" = ${ConversationElement.id} ORDER BY("conversation_reply"."created_at") DESC LIMIT 1`
			)

			//get count message not read

			const queryCountMessagesNotRead = await manager.query(
				`SELECT COUNT("conversation_reply"."id") FROM "conversation_reply" WHERE "conversation_reply"."conversationId" = ${ConversationElement.id} AND "conversation_reply"."userId" != ${existingUser.id} AND "conversation_reply"."read" = FALSE`
			)
			const countMessagesNotRead =
				queryCountMessagesNotRead && queryCountMessagesNotRead[0]
					? Number(queryCountMessagesNotRead[0].count)
					: 0

			overrideConversations.push({
				...ConversationElement,
				...(lastestMessager ? { latest_messager: lastestMessager } : {}),
				messages_not_read: countMessagesNotRead,
			})
		}

		return res.status(200).json({
			code: 200,
			success: true,
			conversations: overrideConversations,
			message: 'Get conversations successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { conversationId, userId } = req.params

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
				message: 'Conversation does not exist in the system',
			})

		//Check exist user
		const existingUser = await Employee.findOne({
			where: {
				id: Number(userId),
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		//Check user exist in the conversation
		if (!existingConversation.employees.some((employee) => employee.id === existingUser.id))
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the conversation',
			})

		await existingConversation.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete conversation successfully',
		})
	}),
}

export default conversationController
