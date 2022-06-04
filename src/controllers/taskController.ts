import { Request, Response } from 'express'
import { Like } from 'typeorm'
import { Employee } from '../entities/Employee'
import { Milestone } from '../entities/Milestone'
import { Project } from '../entities/Project'
import { Status } from '../entities/Status'
import { Task } from '../entities/Task'
import { Task_Category } from '../entities/Task_Category'
import { Task_file } from '../entities/Task_File'
import { createOrUpdateTaskPayload } from '../type/taskPayload'
import handleCatchError from '../utils/catchAsyncError'
import { taskValid } from '../utils/valid/taskValid'

const taskController = {
	//Create new task
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewTask: createOrUpdateTaskPayload = req.body
		const { task_category, project, employees, task_files, status, milestone, assignBy } =
			dataNewTask
		let taskEmployees: Employee[] = []

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
		const existingproject = await Project.findOne({
			where: {
				id: project,
			},
		})
		if (!existingproject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
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

		for (let index = 0; index < employees.length; index++) {
			const employee_id = employees[index]
			const existingEmployee = await Employee.findOne({
				where: {
					id: employee_id,
				},
			})
			if (!existingEmployee)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Employees does not exist in the system',
				})

			//check role employee
			taskEmployees.push(existingEmployee)
		}

		const lasttask = await Task.findOne({
			where: {
				status: {
					id: status,
				},
			},
			order: {
				index: 'DESC',
			},
		})
		var index = lasttask ? lasttask.index + 1 : 1

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
		const { employees, status, project, milestone } = dataUpdateTask
		let taskEmployees: Employee[] = []

		const existingtask = await Task.findOne({
			where: {
				id: Number(id),
			},
		})
		if (!existingtask)
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

		const lasttask = await Task.findOne({
			where: {
				status: {
					id: status,
				},
			},
			order: {
				index: 'DESC',
			},
		})
		var index = lasttask ? lasttask.index + 1 : 1

		//check exist project
		const existingproject = await Project.findOne({
			where: {
				id: Number(project),
			},
		})

		if (!existingproject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
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

		for (let index = 0; index < employees.length; index++) {
			const employee_id = employees[index]
			const existingEmployee = await Employee.findOne({
				where: {
					id: employee_id,
				},
			})
			if (!existingEmployee)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Employees does not exist in the system',
				})

			taskEmployees.push(existingEmployee)
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
			} else {
				existingtask.milestone = existingMilestone
			}
		}

		//update task
		;(existingtask.name = dataUpdateTask.name),
			(existingtask.project = dataUpdateTask.project),
			(existingtask.start_date = new Date(
				new Date(dataUpdateTask.start_date).toLocaleDateString()
			)),
			(existingtask.deadline = new Date(
				new Date(dataUpdateTask.deadline).toLocaleDateString()
			)),
			(existingtask.task_category = dataUpdateTask.task_category),
			(existingtask.employees = taskEmployees),
			(existingtask.index = index),
			(existingtask.status = existingStatus),
			(existingtask.description = dataUpdateTask.description
				? dataUpdateTask.description
				: ''),
			(existingtask.priority = dataUpdateTask.priority)

		await existingtask.save()

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

		const existingtask = await Task.findOne({
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

		if (!existingtask)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'task does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			task: existingtask,
			message: 'Get detail of task success',
		})
	}),

	//Delete task
	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingtask = await Task.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingtask)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'task does not exist in the system',
			})

		await existingtask.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete task success',
		})
	}),

	deletemany: handleCatchError(async (req: Request, res: Response) => {
		const { tasks } = req.body

		//check array of tasks
		if (!Array.isArray(tasks) || !tasks)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})
		for (let index = 0; index < tasks.length; index++) {
			const itemtask = tasks[index]
			const existingtask = await Task.findOne({
				where: {
					id: itemtask.id,
				},
			})
			if (existingtask) {
				await existingtask.remove()
			}
		}
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete tasks success',
		})
	}),

	changeposition: handleCatchError(async (req: Request, res: Response) => {
		const { id1, id2, status1, status2 } = req.body

		const existingstatus1 = Task.findOne({
			where: {
				id: status1,
			},
		})
		const existingstatus2 = Task.findOne({
			where: {
				id: status2,
			},
		})
		if (!existingstatus1 && !existingstatus2)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Either status does not existing in the system',
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
					message: 'Either status does not exist in the system',
				})

			if (task1.index > task2.index) {
				const alltask = await Task.createQueryBuilder('task')
					.where('task.index >= :index and task.statusId = :status', {
						index: task2.index,
						status: status1,
					})
					.getMany()

				if (alltask)
					await Promise.all(
						alltask.map(async (task) => {
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
				const alltask = await Task.createQueryBuilder('task')
					.where(
						'task.index > :index and task.index <= :index2 and task.statusId = :status',
						{
							index: task1.index,
							index2: task2.index,
							status: status2,
						}
					)
					.getMany()

				if (alltask)
					await Promise.all(
						alltask.map(async (task) => {
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
					message: 'Either status does not exist in the system',
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

			const alltask = await Task.createQueryBuilder('task')
				.where('task.statusId = :status and task.index >= :index', {
					status: status2,
					index: task2?.index,
				})
				.getMany()

			if (alltask)
				await Promise.all(
					alltask.map(async (task) => {
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
		const exisitingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
		})

		if (!exisitingProject)
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
					id: exisitingProject.id,
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
		const exisitingEmployee = await Employee.findOne({
			where: {
				id: Number(employeeId),
			},
		})

		if (!exisitingEmployee)
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
					id: exisitingEmployee.id,
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

		//Task was creted by current user
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
					id: exisitingEmployee.id,
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
		const exisitingEmployee = await Employee.findOne({
			where: {
				id: Number(employeeId),
			},
		})

		if (!exisitingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		//Check exist project
		const exisitingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
		})

		if (!exisitingProject)
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
					id: exisitingEmployee.id,
				},
				project: {
					id: exisitingProject.id,
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

		//Task was creted by current user
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
					id: exisitingEmployee.id,
				},
				project: {
					id: exisitingProject.id,
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
