import { Request, Response } from 'express'
import { Task_Category } from '../entities/Task_Category'
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

		const createdtask_category = await Task_Category.create(dataNewCategory).save()

		return res.status(200).json({
			code: 200,
			success: true,
			taskCategory: createdtask_category,
			message: 'Created new task_category successfully',
		})
	}),

	//Update task category
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdatetask_category: Task_Category = req.body
		const { name } = dataUpdatetask_category

		const existingtask_category = await Task_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		//check existed task_category
		if (!existingtask_category)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'task category does not exist in the system',
			})

		if (name !== existingtask_category.name) {
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

		await Task_Category.update(existingtask_category.id, {
			...dataUpdatetask_category,
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update task category successfully',
		})
	}),

	//Get all task category
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const task_categories = await Task_Category.find()
		return res.status(200).json({
			code: 200,
			success: true,
			taskCategories: task_categories,
			message: 'Get all task categories successfully',
		})
	}),

	//Get detail task category
	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingtask_category = await Task_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingtask_category)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'task_category does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			taskCategory: existingtask_category,
			message: 'Get detail of task_category successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingtask_category = await Task_Category.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingtask_category)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'task category does not exist in the system',
			})

		//Delete task category
		await existingtask_category.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete task_category successfully',
		})
	}),
}

export default taskCategoryController
