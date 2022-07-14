import { Request, Response } from 'express'
import { Project_Category } from '../entities/Project_Category'
import handleCatchError from '../utils/catchAsyncError'

const projectCategoryController = {
	//Create new project category
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewCategory: Project_Category = req.body
		const { name } = dataNewCategory

		//Check existing name
		const existingName = await Project_Category.findOne({
			where: {
				name: String(name),
			},
		})

		if (existingName)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project category already exist in the system',
			})

		const createdProjectCategory = await Project_Category.create(dataNewCategory).save()

		return res.status(200).json({
			code: 200,
			success: true,
			project_category: createdProjectCategory,
			message: 'Created new project_category successfully',
		})
	}),

	//Update project category
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateProjectCategory: Project_Category = req.body
		const { name } = dataUpdateProjectCategory

		const existingProjectCategory = await Project_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		//check existed project_category
		if (!existingProjectCategory)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project category does not exist in the system',
			})

		if (name !== existingProjectCategory.name) {
			const existingName = await Project_Category.findOne({
				where: {
					name: String(name),
				},
			})

			if (existingName)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'project_category already exist in the system',
				})
		}

		await Project_Category.update(existingProjectCategory.id, {
			...dataUpdateProjectCategory,
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update project category successfully',
		})
	}),

	//Get all project category
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const projectCategories = await Project_Category.find()
		return res.status(200).json({
			code: 200,
			success: true,
			projectCategories: projectCategories,
			message: 'Get all project categories successfully',
		})
	}),

	//Get detail project category
	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingProjectCategory = await Project_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingProjectCategory)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'project_category does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			project_category: existingProjectCategory,
			message: 'Get detail of project_category successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingProjectCategory = await Project_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingProjectCategory)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project category does not exist in the system',
			})

		//Delete project category
		await existingProjectCategory.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete project_category successfully',
		})
	}),
}

export default projectCategoryController
