import { Request, Response } from 'express'
import { Client } from '../entities/Client.entity'
import { Contract } from '../entities/Contract.entity'
import { Discussion } from '../entities/Discussion.entity'
import { Employee } from '../entities/Employee.entity'
import { createOrUpdateDiscussionPayload } from '../type/DiscussionPayload'
import handleCatchError from '../utils/catchAsyncError'
import { discussionValid } from '../utils/valid/discussionValid'

const discussionController = {
	//Create new discussion
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewDiscussion: createOrUpdateDiscussionPayload = req.body
		const { client, employee, contract } = dataNewDiscussion

		//Check valid input
		const messageValid = discussionValid.createOrUpdate(dataNewDiscussion)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check exist client

		const existingAuthor = client
			? await Client.findOne({
					where: {
						id: client,
					},
			  })
			: await Employee.findOne({
					where: {
						id: employee,
					},
			  })

		if (!existingAuthor)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		//Check exist contract
		const existingContract = await Contract.findOne({
			where: {
				id: contract,
			},
		})

		if (!existingContract)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract doest not exist in the system',
			})

		//Create new discussion
		const createdDiscussion = await Discussion.create({
			...(client
				? {
						client: existingAuthor,
				  }
				: { employee: existingAuthor }),
			contract: existingContract,
			content: dataNewDiscussion.content,
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			discussion: createdDiscussion,
			message: 'Created new discussion successfully',
		})
	}),

	getByContract: handleCatchError(async (req: Request, res: Response) => {
		const { contractId } = req.params

		//Check exist contract
		const existingContract = await Contract.findOne({
			where: {
				id: Number(contractId),
			},
		})

		if (!existingContract)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract doest not exist in the system',
			})

		//Get all discussion
		const discussions = await Discussion.find({
			where: {
				contract: { id: Number(contractId) },
			},
			order: {
				createdAt: 'DESC',
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			discussions,
			message: 'Get discussions by contract successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { discussionId } = req.params

		//Check exist discussion
		const existingDiscussion = await Discussion.findOne({
			where: {
				id: Number(discussionId),
			},
		})

		if (!existingDiscussion)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Discussion doest not exist in the system',
			})

		//Delete discussion
		await existingDiscussion.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Deleted discussion successfully',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const { discussionId } = req.params
		const { email_author, content } = req.body

		if (!content || !email_author)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please enter full field',
			})

		//Check exist discussion
		const existingDiscussion = await Discussion.findOne({
			where: {
				id: Number(discussionId),
			},
		})

		if (!existingDiscussion)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Discussion doest not exist in the system',
			})

		//Check author
		const getMailAuthor = existingDiscussion.client?.email
			? existingDiscussion.client.email
			: existingDiscussion.employee?.email
			? existingDiscussion.employee.email
			: ''

		if (getMailAuthor === email_author) {
			//update discussion
			await Discussion.update(Number(discussionId), {
				content,
			})
		} else {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You are not authorized to perform this action',
			})
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated discussion successfully',
		})
	}),
}

export default discussionController
