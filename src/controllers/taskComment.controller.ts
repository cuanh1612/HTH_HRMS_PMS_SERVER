import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Employee, enumRole } from '../entities/Employee.entity'
import { Project } from '../entities/Project.entity'
import { Task } from '../entities/Task.entity'
import { Task_comment } from '../entities/Task_Comment.entity'
import { createOrUpdateTaskCommentPayload } from '../type/TaskCommentPayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'
import { taskCommentValid } from '../utils/valid/taskCommentValid'

const taskCommentController = {
	//Create new discussion
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewTaskComment: createOrUpdateTaskCommentPayload = req.body
		const { task, project } = dataNewTaskComment

		//Check valid input
		const messageValid = taskCommentValid.createOrUpdate(dataNewTaskComment)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing task
		const existingTask = await Task.findOne({
			where: {
				id: task,
			},
		})

		if (!existingTask)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Task does not exist in the system',
			})

		//check exists project
		const existingProject = await Project.findOne({
			where: {
				id: project,
			},
		})
		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//check exist current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		//Get data user
		const existingUser = await Employee.findOne({
			where: {
				id: decode.userId,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		if (
			!existingProject.employees.some(
				(employeeItem) => employeeItem.email === existingUser.email
			) &&
			existingUser.role !== enumRole.ADMIN
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You not have authorization',
			})

		//Create new task comment
		const createdTaskComment = await Task_comment.create({
			task: existingTask,
			content: dataNewTaskComment.content,
			employee: existingUser
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			taskComment: createdTaskComment,
			message: 'Created new task comment successfully',
		})
	}),

	getByTask: handleCatchError(async (req: Request, res: Response) => {
		const { taskId } = req.params

		//Check exist task
		const existingTask = await Task.findOne({
			where: {
				id: Number(taskId),
			},
		})

		if (!existingTask)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Task doest not exist in the system',
			})

		//Get all task comment
		const taskComments = await Task_comment.find({
			where: {
				task: { id: Number(taskId) },
			},
			relations: {
				employee: true
			},
			order: {
				createdAt: 'DESC',
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			taskComments,
			message: 'Get task comments by task successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { taskCommentId } = req.params

		//Check exist task comment
		const existingTaskComment = await Task_comment.findOne({
			where: {
				id: Number(taskCommentId),
			},
			relations: {
				employee: true,
			},
		})

		if (!existingTaskComment)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Task comment doest not exist in the system',
			})

		//check exist current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		//Get data user
		const existingUser = await Employee.findOne({
			where: {
				id: decode.userId,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		if (
			existingTaskComment.employee.email !== existingUser.email &&
			existingUser.role !== enumRole.ADMIN
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You not have authorization',
			})

		//Delete task comment
		await existingTaskComment.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Deleted task comment successfully',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const { taskCommentId } = req.params
		const { content } = req.body

		if (!content)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please enter full field',
			})

		//Check exist task comment
		const existingTaskComment = await Task_comment.findOne({
			where: {
				id: Number(taskCommentId),
			},
			relations: {
				employee: true
			}
		})

		if (!existingTaskComment)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Task comment doest not exist in the system',
			})
		//check exist current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		//Get data user
		const existingUser = await Employee.findOne({
			where: {
				id: decode.userId,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		if (
			existingTaskComment.employee.email !== existingUser.email &&
			existingUser.role !== enumRole.ADMIN
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You not have authorization',
			})

		//Update task comment
		existingTaskComment.content = content
		await existingTaskComment.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated discussion successfully',
		})
	}),
}

export default taskCommentController
