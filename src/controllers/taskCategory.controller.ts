import { Request, Response } from 'express'
import { Task_Category } from '../entities/Task_Category.entity'
import handleCatchError from '../utils/catchAsyncError'

const taskCategoryController = {
	//Create new task category
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewCategory: Task_Category = req.body
		const { name } = dataNewCategory

		//Check existing name
		const existingName = await Task_Category.findOne({
			where: {
				name: String(name),
			},
		})

		if (existingName)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Task category already exist in the system',
			})

		const taskCategory = await Task_Category.create(dataNewCategory).save()

		return res.status(200).json({
			code: 200,
			success: true,
			taskCategory,
			message: 'Created new task_category successfully',
		})
	}),

	//Update task category
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdate: Task_Category = req.body
		const { name } = dataUpdate

		const existingTaskCategory = await Task_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		//check existed task_category
		if (!existingTaskCategory)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'task category does not exist in the system',
			})

		if (name !== existingTaskCategory.name) {
			const existingName = await Task_Category.findOne({
				where: {
					name: String(name),
				},
			})

			if (existingName)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'task_category already exist in the system',
				})
		}

		await Task_Category.update(existingTaskCategory.id, {
			...dataUpdate,
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update task category successfully',
		})
	}),

	//Get all task category
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const taskCategories = await Task_Category.find()
		return res.status(200).json({
			code: 200,
			success: true,
			taskCategories,
			message: 'Get all task categories successfully',
		})
	}),

	//Get detail task category
	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingTaskCategory = await Task_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingTaskCategory)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'task_category does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			taskCategory: existingTaskCategory,
			message: 'Get detail of task_category successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingTaskCategory = await Task_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingTaskCategory)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'task category does not exist in the system',
			})

		//Delete task category
		await existingTaskCategory.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete task_category successfully',
		})
	}),
}

export default taskCategoryController
