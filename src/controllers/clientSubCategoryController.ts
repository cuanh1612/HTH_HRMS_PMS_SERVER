import { Request, Response } from 'express'
import { Client_Category } from '../entities/Client_Category'
import { Client_Sub_Category } from '../entities/Client_Sub_Category'
import { createOrUpdatetClientSubCategoryPayload } from '../type/ClientSubCategoryPayload'
import handleCatchError from '../utils/catchAsyncError'
import { clientSubCategoryValid } from '../utils/valid/clientSubCategoryValid'

const clientSubCategoryController = {
	//Create new client sub category
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewSubCategory: createOrUpdatetClientSubCategoryPayload = req.body

		//Check valid
		const messageValid = clientSubCategoryValid.createOrUpdate(dataNewSubCategory)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing client category
		const existingClientCategory = await Client_Category.findOne({
			where: {
				id: dataNewSubCategory.client_category,
			},
		})

		if (!existingClientCategory)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client category does not exist',
			})

		//Create new client sub category
		const createdSubCategory = await Client_Sub_Category.create({
			...dataNewSubCategory,
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			clientSubCategory: createdSubCategory,
			message: 'Created new client sub category successfully',
		})
	}),
	//update client sub category
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateSubCategory: createOrUpdatetClientSubCategoryPayload = req.body

		//Check valid
		const messageValid = clientSubCategoryValid.createOrUpdate(dataUpdateSubCategory)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check exist client sub category
		const existingSubCategory = await Client_Sub_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingSubCategory)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client sub category does not exist in the system',
			})

		//Check exist client category
		const existingClientCategory = await Client_Category.findOne({
			where: {
				id: dataUpdateSubCategory.client_category,
			},
		})

		if (!existingClientCategory)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client category does not exist in the system',
			})

		//Update client sub category
		await Client_Sub_Category.update(existingSubCategory.id, {
			...dataUpdateSubCategory,
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update client sub category successfully',
		})
	}),

	//Get all client sub category
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const clientSubCategories = await Client_Sub_Category.find()
		return res.status(200).json({
			code: 200,
			success: true,
			clientSubCategories,
			message: 'Get all client categories successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingSubCategory = await Client_Sub_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingSubCategory)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client sub category does not exist in the system',
			})

		//Delete client category
		await existingSubCategory.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete client sub category successfully',
		})
	}),
}

export default clientSubCategoryController
