import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Like } from 'typeorm'
import { Employee } from '../entities/Employee'
import { Milestone } from '../entities/Milestone'
import { Notification } from '../entities/Notification'
import { Project } from '../entities/Project'
import { Status } from '../entities/Status'
import { Task } from '../entities/Task'
import { Task_Category } from '../entities/Task_Category'
import { Task_file } from '../entities/Task_File'
import { createOrUpdateTaskPayload } from '../type/taskPayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'
import { CreateProjectActivity } from '../utils/helper'
import { taskValid } from '../utils/valid/taskValid'

const taskController = {
	//Create new task
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewTask: createOrUpdateTaskPayload = req.body
		const { task_category, project, employees, task_files, status, milestone, assignBy, name } =
			dataNewTask
		let taskEmployees: Employee[] = []

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

		//check valid
		const messageValid = taskValid.createOrUpdate(dataNewTask)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//check exist status
		const existingStatus = await Status.findOne({
			where: {
				id: status,
			},
		})

		if (!existingStatus)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Status does not existing',
			})

		//check exist project
		const existingProject = await Project.findOne({
			where: {
				id: project,
			},
			relations: {
				project_Admin: true,
			},
		})
		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		if (
			existingUser.role !== 'Admin' &&
			existingProject.project_Admin.email !== existingUser.email
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You do not have permission to perform this operation',
			})

		//Check existing name
		const existingTaskName = await Task.findOne({
			where: {
				project: {
					id: existingProject.id,
				},
				name: name,
			},
		})

		if (existingTaskName)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Task name already existing in this project',
			})

		//Check exist task category
		const existingCategories = await Task_Category.findOne({
			where: {
				id: task_category,
			},
		})
		if (!existingCategories) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Task Category does not exist in the system',
			})
		}

		//Check exist milestone
		if (milestone) {
			const existingMilestone = await Milestone.findOne({
				where: {
					id: milestone,
				},
			})
			if (!existingMilestone) {
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Milestone does not exist in the system',
				})
			}
		}

		// check employee who create task
		if (!assignBy)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee who create task does not exist in the system',
			})
		const assignByUser = Employee.findOne({
			where: {
				id: Number(assignBy),
			},
		})
		if (!assignByUser) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee who create task does not exist in the system',
			})
		}

		await Promise.all(
			employees.map(async (employee_id: number) => {
				return new Promise(async (resolve) => {
					const existingEmployee = await Employee.findOne({
						where: {
							id: employee_id,
						},
					})

					if (existingEmployee)
						//check role employee
						taskEmployees.push(existingEmployee)
					resolve(true)
				})
			})
		)

		const lastTask = await Task.findOne({
			where: {
				status: {
					id: status,
				},
			},
			order: {
				index: 'DESC',
			},
		})
		var index = lastTask ? lastTask.index + 1 : 1

		//create task
		const createdTask = await Task.create({
			...dataNewTask,
			employees: taskEmployees,
			index,
			assignBy: {
				id: Number(assignBy),
			},
		}).save()

		if (Array.isArray(task_files)) {
			//create task files

			for (let index = 0; index < task_files.length; index++) {
				const task_file = task_files[index]
				await Task_file.create({
					...task_file,
					task: task_file,
				}).save()
			}
		}

		//Huy lam - create notification for employee
		await Promise.all(
			taskEmployees.map(async (employee) => {
				return new Promise(async (resolve) => {
					//create notification
					await Notification.create({
						employee,
						url: `/projects/${existingProject.id}/tasks-table`,
						content: 'You have just been assigned to a new task',
					}).save()

					resolve(true)
				})
			})
		)

		await CreateProjectActivity(res, existingProject.id, "New Task Added To The Project")

		return res.status(200).json({
			code: 200,
			success: true,
			task: createdTask,
			message: ' Create new Task success',
		})
	}),

	//Update Task
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateTask: createOrUpdateTaskPayload = req.body
		// const { task_category, project, employees} = dataUpdateTask
		const { employees, status, project, milestone, name } = dataUpdateTask
		let taskEmployees: Employee[] = []

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

		const existingTask = await Task.findOne({
			where: {
				id: Number(id),
			},
		})
		if (!existingTask)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Task does not exist in the system',
			})

		const existingStatus = await Status.findOne({
			where: {
				id: Number(status),
			},
		})
		if (!existingStatus)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Task does not exist in the system',
			})

		const lastTask = await Task.findOne({
			where: {
				status: {
					id: status,
				},
			},
			order: {
				index: 'DESC',
			},
		})
		var index = lastTask ? lastTask.index + 1 : 1

		//check exist project
		const existingProject = await Project.findOne({
			where: {
				id: Number(project),
			},
			relations: {
				project_Admin: true,
			},
		})

		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//Check role admin or project admin
		if (
			existingUser.role !== 'Admin' &&
			existingProject.project_Admin.email !== existingUser.email
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You do not have permission to perform this operation',
			})

		//Check existing name
		const existingTaskName = await Task.findOne({
			where: {
				project: {
					id: existingProject.id,
				},
				name: name,
			},
		})

		if (existingTaskName && existingTaskName?.id !== existingTask.id)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Task name already existing in this project',
			})

		//Check valid input create new task
		//Check valid
		const messageValid = taskValid.createOrUpdate(dataUpdateTask)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		await Promise.all(
			employees.map(async (employee_id: number) => {
				return new Promise(async (resolve) => {
					const existingEmployee = await Employee.findOne({
						where: {
							id: employee_id,
						},
					})

					if (existingEmployee)
						//check role employee
						taskEmployees.push(existingEmployee)
					resolve(true)
				})
			})
		)

		//Check exist milestone
		if (milestone) {
			const existingMilestone = await Milestone.findOne({
				where: {
					id: milestone,
				},
			})
			if (!existingMilestone) {
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Milestone does not exist in the system',
				})
			} else {
				existingTask.milestone = existingMilestone
			}
		}

		//update task
		;(existingTask.name = dataUpdateTask.name),
			(existingTask.project = dataUpdateTask.project),
			(existingTask.start_date = new Date(dataUpdateTask.start_date)),
			(existingTask.deadline = new Date(dataUpdateTask.deadline)),
			(existingTask.employees = taskEmployees),
			(existingTask.index = index),
			(existingTask.status = existingStatus),
			(existingTask.description = dataUpdateTask.description
				? dataUpdateTask.description
				: ''),
			(existingTask.priority = dataUpdateTask.priority)

		await existingTask.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update Task success',
		})
	}),

	// get all task and show in calendar
	calendar: handleCatchError(async (req: Request, res: Response) => {
		const { employee, client, name, project }: any = req.query
		var filter: {
			name?: any
			employees?: {
				id: number
			}
			project?: {
				id?: number
				client?: {
					id: number
				}
			}
		} = {}
		if (name) filter.name = Like(String(name))
		if (employee)
			filter.employees = {
				id: Number(employee),
			}
		if (project)
			filter.project = {
				...filter.project,
				id: project,
			}

		if (client)
			filter.project = {
				...filter.project,
				client: {
					id: client,
				},
			}

		const tasks = await Task.find({
			where: filter,
			relations: {
				status: true,
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			tasks,
			message: 'Get all projects success',
		})
	}),

	// get all task and show in calendar
	calendarByEmployee: handleCatchError(async (req: Request, res: Response) => {
		const { client, name, project }: any = req.query
		const { employeeId } = req.params

		//Check exist employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: Number(employeeId),
			},
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		var filter: {
			name?: any
			employees?: {
				id: number
			}
			project?: {
				id?: number
				client?: {
					id: number
				}
			}
		} = {}

		filter.employees = {
			id: existingEmployee.id,
		}
		if (name) filter.name = Like(String(name))
		if (project)
			filter.project = {
				...filter.project,
				id: project,
			}

		if (client)
			filter.project = {
				...filter.project,
				client: {
					id: client,
				},
			}

		const tasks = await Task.find({
			where: filter,
			relations: {
				status: true,
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			tasks,
			message: 'Get all projects success',
		})
	}),

	//Get all task
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const tasks = await Task.find({
			select: {
				time_logs: {
					total_hours: true,
				},
				project: {
					name: true,
					id: true,
				},
				milestone: {
					id: true,
					title: true,
				},
			},
			relations: {
				time_logs: true,
				project: true,
				employees: true,
				status: true,
				milestone: true,
				assignBy: true,
				task_category: true,
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			tasks,
			message: 'Get all projects success',
		})
	}),
	//Get detail task
	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingTask = await Task.findOne({
			where: {
				id: Number(id),
			},
			relations: {
				project: true,
				task_category: true,
				status: true,
				employees: true,
				milestone: true,
				assignBy: true,
			},
		})

		if (!existingTask)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'task does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			task: existingTask,
			message: 'Get detail of task success',
		})
	}),

	//Delete task
	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

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

		const existingTask = await Task.findOne({
			where: {
				id: Number(id),
			},
			relations: {
				project: {
					project_Admin: true,
				},
			},
		})

		if (!existingTask)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'task does not exist in the system',
			})

		//Check role admin or project admin
		if (
			existingUser.role !== 'Admin' &&
			existingTask.project.project_Admin.email !== existingUser.email
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You do not have permission to perform this operation',
			})

		await existingTask.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete task success',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { tasks } = req.body

		//check array of tasks
		if (!Array.isArray(tasks) || !tasks)
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

		await Promise.all(
			tasks.map(async (id: number) => {
				return new Promise(async (resolve) => {
					const existingtask = await Task.findOne({
						where: {
							id: id,
						},
						relations: {
							project: {
								project_Admin: true,
							},
						},
					})

					if (existingtask) {
						//Check role admin or projectt admin
						if (
							existingUser.role !== 'Admin' &&
							existingtask.project.project_Admin.email !== existingUser.email
						)
							return res.status(400).json({
								code: 400,
								success: false,
								message: 'You do not have permission to perform this operation',
							})

						await Task.remove(existingtask)
					}

					return resolve(true)
				})
			})
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete tasks success',
		})
	}),

	changePosition: handleCatchError(async (req: Request, res: Response) => {
		const { id1, id2, status1, status2 } = req.body

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

		const existingStatus1 = await Status.findOne({
			where: {
				id: status1,
			},
			relations: {
				project: {
					project_Admin: true,
				},
			},
		})
		const existingStatus2 = await Status.findOne({
			where: {
				id: status2,
			},
			relations: {
				project: {
					project_Admin: true,
				},
			},
		})

		if (!existingStatus1 && !existingStatus2)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Either status does not existing in the system 3',
			})

		//Check role admin or project admin
		if (
			existingUser.role !== 'Admin' &&
			((existingStatus1 &&
				existingStatus1.project.project_Admin.email !== existingUser.email) ||
				(existingStatus2 &&
					existingStatus2.project.project_Admin.email !== existingUser.email))
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You do not have permission to perform this operation',
			})

		if (status1 == status2) {
			const task1 = await Task.createQueryBuilder('task')
				.where('task.id = :id1', { id1 })
				.getOne()
			const task2 = await Task.createQueryBuilder('task')
				.where('task.id = :id2', { id2 })
				.getOne()

			if (!task1 || !task2)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Either status does not exist in the system 2',
				})

			if (task1.index > task2.index) {
				const allTask = await Task.createQueryBuilder('task')
					.where('task.index >= :index and task.statusId = :status', {
						index: task2.index,
						status: status1,
					})
					.getMany()

				if (allTask)
					await Promise.all(
						allTask.map(async (task) => {
							return new Promise(async (resolve) => {
								const result = Task.update(
									{
										id: Number(task.id),
									},
									{
										index: Number(task.index) + 1,
									}
								)
								resolve(result)
							})
						})
					)
			}

			if (task1.index < task2.index) {
				const allTask = await Task.createQueryBuilder('task')
					.where(
						'task.index > :index and task.index <= :index2 and task.statusId = :status',
						{
							index: task1.index,
							index2: task2.index,
							status: status2,
						}
					)
					.getMany()

				if (allTask)
					await Promise.all(
						allTask.map(async (task) => {
							return new Promise(async (resolve) => {
								task.index = task.index - 1
								resolve(await task.save())
							})
						})
					)
			}

			task1.index = task2.index
			await task1.save()

			return res.status(200).json({
				code: 200,
				success: true,
				message: 'change position of status success',
			})
		} else {
			const task1 = await Task.createQueryBuilder('task')
				.where('task.id = :id1', { id1 })
				.getOne()

			const status2Exist = await Status.findOne({
				where: {
					id: status2,
				},
			})

			if (!task1 || !status2Exist)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Either status does not exist in the system 1',
				})

			if (!id2) {
				const lastTask = await Task.findOne({
					where: {
						status: {
							id: status2,
						},
					},
					order: {
						index: 'DESC',
					},
				})

				task1.index = lastTask ? lastTask.index + 1 : 1
				task1.status = status2Exist

				await task1.save()

				return res.status(200).json({
					code: 200,
					success: true,
					message: 'change position of status success',
				})
			}

			const task2 = await Task.createQueryBuilder('task')
				.where('task.id = :id2', { id2 })
				.getOne()
			const index = task2?.index

			const allTask = await Task.createQueryBuilder('task')
				.where('task.statusId = :status and task.index >= :index', {
					status: status2,
					index: task2?.index,
				})
				.getMany()

			if (allTask)
				await Promise.all(
					allTask.map(async (task) => {
						return new Promise(async (resolve) => {
							task.index = task.index + 1
							resolve(await task.save())
						})
					})
				)

			task1.index = Number(index)
			task1.status = status2Exist

			await task1.save()

			return res.status(200).json({
				code: 200,
				success: true,
				message: 'change position of status success',
			})
		}
	}),

	getByProject: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params

		//Check exist project
		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
		})

		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//Get tasks by project
		const tasks = await Task.find({
			select: {
				time_logs: {
					total_hours: true,
				},
				project: {
					name: true,
				},
				milestone: {
					id: true,
					title: true,
				},
			},
			where: {
				project: {
					id: existingProject.id,
				},
			},
			relations: {
				time_logs: true,
				project: true,
				employees: true,
				status: true,
				milestone: true,
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			tasks,
			message: 'Get tasks by projects successfully',
		})
	}),

	//huy
	getByEmployee: handleCatchError(async (req: Request, res: Response) => {
		const { employeeId } = req.params

		//Check exist employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: Number(employeeId),
			},
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		//Get tasks by employee
		const tasksAssigned = await Task.find({
			select: {
				time_logs: {
					total_hours: true,
				},
				project: {
					name: true,
				},
				milestone: {
					id: true,
					title: true,
				},
			},
			where: {
				employees: {
					id: existingEmployee.id,
				},
			},
			relations: {
				time_logs: true,
				project: true,
				employees: true,
				status: true,
				milestone: true,
				assignBy: true,
			},
		})

		//Task was create by current user
		const tasksWasCreated = await Task.find({
			select: {
				time_logs: {
					total_hours: true,
				},
				project: {
					name: true,
				},
				milestone: {
					id: true,
					title: true,
				},
			},
			where: {
				assignBy: {
					id: existingEmployee.id,
				},
			},
			relations: {
				time_logs: true,
				project: true,
				employees: true,
				status: true,
				milestone: true,
				assignBy: true,
			},
		})

		// merge arrays
		// using the concat() method
		// concat() method returns a new array
		const tasksMerge = tasksAssigned.concat(tasksWasCreated)

		// use for loop to remove duplicate items
		for (var i = 0; i < tasksMerge.length; ++i) {
			for (var j = i + 1; j < tasksMerge.length; ++j) {
				if (tasksMerge[i].id === tasksMerge[j].id) tasksMerge.splice(j--, 1)
			}
		}

		return res.status(200).json({
			code: 200,
			success: true,
			tasks: tasksMerge,
			message: 'Get tasks by employee successfully',
		})
	}),

	getByEmployeeAndProject: handleCatchError(async (req: Request, res: Response) => {
		const { employeeId, projectId } = req.params

		//Check exist employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: Number(employeeId),
			},
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		//Check exist project
		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
		})

		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//Get tasks by employee
		const tasksAssigned = await Task.find({
			select: {
				time_logs: {
					total_hours: true,
				},
				project: {
					name: true,
				},
				milestone: {
					id: true,
					title: true,
				},
			},
			where: {
				employees: {
					id: existingEmployee.id,
				},
				project: {
					id: existingProject.id,
				},
			},
			relations: {
				time_logs: true,
				project: true,
				employees: true,
				status: true,
				milestone: true,
				assignBy: true,
			},
		})

		//Task was created by current user
		const tasksWasCreated = await Task.find({
			select: {
				time_logs: {
					total_hours: true,
				},
				project: {
					name: true,
				},
				milestone: {
					id: true,
					title: true,
				},
			},
			where: {
				assignBy: {
					id: existingEmployee.id,
				},
				project: {
					id: existingProject.id,
				},
			},
			relations: {
				time_logs: true,
				project: true,
				employees: true,
				status: true,
				milestone: true,
				assignBy: true,
			},
		})

		// merge arrays
		// using the concat() method
		// concat() method returns a new array
		const tasksMerge = tasksAssigned.concat(tasksWasCreated)

		// use for loop to remove duplicate items
		for (var i = 0; i < tasksMerge.length; ++i) {
			for (var j = i + 1; j < tasksMerge.length; ++j) {
				if (tasksMerge[i].id === tasksMerge[j].id) tasksMerge.splice(j--, 1)
			}
		}

		return res.status(200).json({
			code: 200,
			success: true,
			tasks: tasksMerge,
			message: 'Get tasks by employee successfully',
		})
	}),
}

export default taskController
