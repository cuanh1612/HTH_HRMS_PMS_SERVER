import { Request, Response } from 'express'
import { Client_Category } from '../entities/Client_Category'
import handleCatchError from '../utils/catchAsyncError'

const clientCategoryController = {
	//Create new client category
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewClientCategory: Client_Category = req.body
		const createdClientCategory = await Client_Category.create(dataNewClientCategory).save()

		return res.status(200).json({
			code: 200,
			success: true,
			clientCategory: createdClientCategory,
			message: 'Created new client category successfully',
		})
	}),
	//update client category
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateCategory: Client_Category = req.body

		const existingClientCategory = await Client_Category.findOne({
			where: {
				id: Number(id),
			},
		})
		//check existed client category
		if (!existingClientCategory)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client category does not exist in the system',
			})
        
		await Client_Category.update(existingClientCategory.id, {
			...dataUpdateCategory,
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update client category successfully',
		})
	}),

	//Get all client category
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const clientCategories = await Client_Category.find()
		return res.status(200).json({
			code: 200,
			success: true,
			clientCategories,
			message: 'Get all client categories successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingClientCategory = await Client_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingClientCategory)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client category does not exist in the system',
			})

		//Delete client category
		await existingClientCategory.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete client category successfully',
		})
	}),
}

export default clientCategoryController
