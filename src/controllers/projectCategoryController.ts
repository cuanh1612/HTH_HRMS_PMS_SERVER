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

		const createdproject_category = await Project_Category.create(dataNewCategory).save()

		return res.status(200).json({
			code: 200,
			success: true,
			project_category: createdproject_category,
			message: 'Created new project_category successfully',
		})
	}),

	//Update project category
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateproject_category: Project_Category = req.body
		const { name } = dataUpdateproject_category

		const existingproject_category = await Project_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		//check existed project_category
		if (!existingproject_category)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project category does not exist in the system',
			})

		if (name !== existingproject_category.name) {
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

		await Project_Category.update(existingproject_category.id, {
			...dataUpdateproject_category,
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update project category successfully',
		})
	}),

	//Get all project category
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const project_categories = await Project_Category.find()
		return res.status(200).json({
			code: 200,
			success: true,
			project_categorys: project_categories,
			message: 'Get all project categories successfully',
		})
	}),

	//Get detail project category
	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingproject_category = await Project_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingproject_category)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'project_category does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			project_category: existingproject_category,
			message: 'Get detail of project_category successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingproject_category = await Project_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingproject_category)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project category does not exist in the system',
			})

		//Delete project category
		await existingproject_category.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete project_category successfully',
		})
	}),
}

export default projectCategoryController
