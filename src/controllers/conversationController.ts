import { Request, Response } from 'express'
import { Conversation } from '../entities/Conversation'
import { Employee } from '../entities/Employee'
import { createOrUpdateConversationPayload } from '../type/ConversationPayload'
import handleCatchError from '../utils/catchAsyncError'

const conversationController = {
	//Create new conversation
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewConversation: createOrUpdateConversationPayload = req.body
		const { user_one, user_two } = dataNewConversation

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
				employees: [{ id: existingUserOne.id }, { id: existingUserTwo.id }],
			},
		})

		let isExistConversation = false
		for (let index = 0; index < conversations.length; index++) {
			const conversation = conversations[index]
			if (conversation.employees.length === 2) {
				isExistConversation = true
				console.log(index)
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
				employees: [{id: existingUser.id}]
			}
		})

		return res.status(200).json({
			code: 200,
			success: true,
			conversations,
			message: 'Get conversations successfully',
		})
	}),
}

export default conversationController
