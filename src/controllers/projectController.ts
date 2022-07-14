import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { getManager } from 'typeorm'
import { Client } from '../entities/Client'
import { Department } from '../entities/Department'
import { Employee, enumRole } from '../entities/Employee'
import { Hourly_rate_project } from '../entities/Hourly_rate_project'
import { Notification } from '../entities/Notification'
import { enumProjectStatus, Project } from '../entities/Project'
import { Project_Category } from '../entities/Project_Category'
import { Project_file } from '../entities/Project_File'
import { Status } from '../entities/Status'
import { Task } from '../entities/Task'
import { createOrUpdateProjectPayload } from '../type/ProjectPayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'
import { projectValid } from '../utils/valid/projectValid'

const projectController = {
	//Create new project
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewProject: createOrUpdateProjectPayload = req.body
		const { project_category, department, client, employees, Added_by, project_files } =
			dataNewProject
		let projectEmployees: Employee[] = []

		//Check valid input create new project
		//Check valid
		const messageValid = projectValid.createOrUpdate(dataNewProject, 'create')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//check exist Added by
		if (Added_by) {
			const existingAddedBy = await Employee.findOne({
				where: {
					id: Added_by,
				},
			})
			if (!existingAddedBy)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Admin add this project does not exist in the system',
				})
		}

		//check exist client
		const existingClient = await Client.findOne({
			where: {
				id: client,
			},
		})
		if (!existingClient)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client does not exist in the system',
			})

		//check exist department
		const existingDepartment = await Department.findOne({
			where: {
				id: department,
			},
		})
		if (!existingDepartment)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Department does not exist in the system',
			})

		//check exist project categories
		const existingCategories = await Project_Category.findOne({
			where: {
				id: project_category,
			},
		})
		if (!existingCategories)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Category does not exist in the system',
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
						projectEmployees.push(existingEmployee)
					resolve(true)
				})
			})
		)

		//create project file
		const createdProject = await Project.create({
			...dataNewProject,
			start_date: new Date(dataNewProject.start_date),
			deadline: new Date(dataNewProject.deadline),
			employees: projectEmployees,
		}).save()

		await Promise.all(
			projectEmployees.map(async (employee) => {
				return new Promise(async (resolve) => {
					const hourlyRateExist = await Hourly_rate_project.findOne({
						where: {
							project: {
								id: createdProject.id,
							},
							employee: {
								id: employee.id,
							},
						},
					})
					if (hourlyRateExist) return resolve(true)
					resolve(
						await Hourly_rate_project.insert({
							project: {
								id: createdProject.id,
							},
							employee: {
								id: employee.id,
							},
							hourly_rate: employee.hourly_rate,
						})
					)
				})
			})
		)

		if (project_files) {
			//Create project files
			for (let index = 0; index < project_files.length; index++) {
				const project_file = project_files[index]
				await Project_file.create({
					...project_file,
					project: createdProject,
				}).save()
			}
		}

		await Status.create({
			title: 'Incomplete',
			root: true,
			project: createdProject,
			index: 0,
			color: '#ff0000',
		}).save()

		await Status.create({
			title: 'Complete',
			root: true,
			project: createdProject,
			index: 1,
			color: '#00ff14',
		}).save()

		//Huy lam
		await Promise.all(
			projectEmployees.map(async (employee) => {
				return new Promise(async (resolve) => {
					//create notification
					await Notification.create({
						employee,
						url: '/projects',
						content: 'You have just been assigned to a new project',
					}).save()

					resolve(true)
				})
			})
		)

		//huy lam
		//create note for client
		await Notification.create({
			client: existingClient,
			url: '/projects',
			content: 'You have just been assigned to a new project',
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			project: createdProject,
			message: 'Create new Project successfully',
		})
	}),

	//Update Project
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateProject: createOrUpdateProjectPayload = req.body
		const { Added_by, client, department, project_category } = dataUpdateProject

		const existingProject = await Project.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//Check valid input create new project
		//Check valid
		const messageValid = projectValid.createOrUpdate(dataUpdateProject, 'update')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//check exist Added by
		const existingAddedBy = await Employee.findOne({
			where: {
				id: Added_by,
			},
		})
		if (!existingAddedBy)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Admin add this project does not exist in the system',
			})

		//check exist client
		const existingClient = await Client.findOne({
			where: {
				id: client,
			},
		})
		if (!existingClient)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client does not exist in the system',
			})
		//check exist department
		const existingDepartment = await Department.findOne({
			where: {
				id: department,
			},
		})
		if (!existingDepartment)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Department does not exist in the system',
			})
		//check exist project categories
		const existingCategories = await Project_Category.findOne({
			where: {
				id: project_category,
			},
		})
		if (!existingCategories)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Category does not exist in the system',
			})

			//update project
		;(existingProject.name = dataUpdateProject.name),
			(existingProject.project_category = existingCategories),
			(existingProject.department = existingDepartment),
			(existingProject.client = existingClient),
			(existingProject.Added_by = existingAddedBy),
			(existingProject.start_date = dataUpdateProject.start_date),
			(existingProject.deadline = dataUpdateProject.deadline),
			(existingProject.send_task_noti = true),
			(existingProject.project_summary = dataUpdateProject.project_summary),
			(existingProject.notes = dataUpdateProject.notes),
			(existingProject.project_status = dataUpdateProject.project_status),
			(existingProject.currency = dataUpdateProject.currency),
			(existingProject.project_budget = dataUpdateProject.project_budget),
			(existingProject.hours_estimate = dataUpdateProject.hours_estimate),
			await existingProject.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update Project successfully',
		})
	}),

	// get all project (normal)
	getAllNormal: handleCatchError(async (_: Request, res: Response) => {
		const projects = await Project.find({})
		return res.status(200).json({
			code: 200,
			success: true,
			projects,
			message: 'Get all projects success',
		})
	}),

	// get all project (normal) by employee
	getAllNormalByEmployee: handleCatchError(async (req: Request, res: Response) => {
		const { employeeId } = req.params

		//Check existing employee
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

		const projects = await Project.find({
			where: {
				employees: {
					id: existingEmployee.id,
				},
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			projects,
			message: 'Get all projects success',
		})
	}),

	//Get all project with info of employees and client in project
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const projects = await Project.find({
			relations: {
				employees: true,
				client: true,
			},
		})
		return res.status(200).json({
			code: 200,
			success: true,
			projects,
			message: 'Get all projects success',
		})
	}),

	//Get all project with info of employees and client in project
	getAllByCurrentUser: handleCatchError(async (req: Request, res: Response) => {
		//check exist current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		if (!decode)
			return res.status(400).json({
				code: 401,
				success: false,
				message: 'Please login first',
			})

		//Create filter
		var filter: {
			employees?: {
				id: number
			}
			client?: {
				id: number
			}
		} = {}
		if (decode.role === 'Employee')
			filter.employees = {
				id: Number(decode.userId),
			}

		if (decode.role === 'Client')
			filter.client = {
				id: Number(decode.userId),
			}

		const projects = await Project.find({
			relations: {
				employees: true,
				client: true,
			},
			where: filter,
		})
		return res.status(200).json({
			code: 200,
			success: true,
			projects,
			message: 'Get all projects success',
		})
	}),

	//Get employee not in the project
	getEmployeeNotIn: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params

		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
			relations: {
				employees: true,
			},
		})

		if (!existingProject)
			return res.status(400).json({
				code: 200,
				success: false,
				message: 'Project does not exist in the system',
			})

		const idEmployees = existingProject.employees.map((employee) => {
			return employee.id
		})

		const allEmployees = await Employee.createQueryBuilder('employee')
			.where('employee.id NOT IN (:...ids)', {
				ids: idEmployees,
			})
			.getMany()

		return res.status(200).json({
			code: 200,
			success: true,
			employees: allEmployees,
			message: 'Get employee not in the project success',
		})
	}),

	//Assign Employee into project
	assignEmployee: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params
		const { employees }: { employees: Array<number> } = req.body

		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
			relations: {
				employees: true,
			},
		})
		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		const allEmployees = await Employee.createQueryBuilder('employee')
			.where('employee.id IN (:...ids)', {
				ids: employees,
			})
			.getMany()

		await Promise.all(
			allEmployees.map(async (employee) => {
				return new Promise(async (resolve) => {
					const hourlyRateExist = await Hourly_rate_project.findOne({
						where: {
							project: {
								id: existingProject.id,
							},
							employee: {
								id: employee.id,
							},
						},
					})
					if (hourlyRateExist) return resolve(true)
					resolve(
						await Hourly_rate_project.insert({
							project: {
								id: existingProject.id,
							},
							employee: {
								id: employee.id,
							},
							hourly_rate: employee.hourly_rate,
						})
					)
				})
			})
		)

		existingProject.employees = [...existingProject.employees, ...allEmployees]
		await existingProject.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Assign employee success',
		})
	}),

	//Assign Employee into project by department
	assignEmployeeByDepartment: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params
		const { departments }: { departments: Array<number> } = req.body

		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
			relations: {
				employees: true,
			},
		})
		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		const allEmployees = await Employee.createQueryBuilder('employee')
			.where('"departmentId" IN (:...ids)', {
				ids: departments,
			})
			.getMany()

		if (allEmployees.length == 0)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'There are no employees left to participate in the project',
			})

		await Promise.all(
			allEmployees.map(async (employee) => {
				return new Promise(async (resolve) => {
					resolve(
						await Hourly_rate_project.insert({
							project: {
								id: existingProject.id,
							},
							employee: {
								id: employee.id,
							},
							hourly_rate: employee.hourly_rate,
						})
					)
				})
			})
		)

		existingProject.employees = [...existingProject.employees, ...allEmployees]
		await existingProject.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Assign employee success',
		})
	}),

	//Get detail project
	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingProject = await Project.findOne({
			relations: {
				client: true,
				employees: true,
				project_Admin: true
			},
			where: {
				id: Number(id),
			},
		})

		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//Calculate percentage of project progress from completed tasks
		const countSuccessTasks = await Task.createQueryBuilder('task')
			.leftJoinAndSelect('status', 'status', 'task.statusId = status.id')
			.where('task.projectId = :id', {
				id: existingProject.id,
			})
			.andWhere('status.title = :title', {
				title: 'Complete',
			})
			.getCount()

		const countTasks = await Task.createQueryBuilder('task')
			.leftJoinAndSelect('status', 'status', 'task.statusId = status.id')
			.where('task.projectId = :id', {
				id: existingProject.id,
			})
			.getCount()

		if (countSuccessTasks !== 0 && countTasks !== 0) {
			existingProject.Progress = Math.round((countSuccessTasks / countTasks) * 100)
			await existingProject.save()
		}

		return res.status(200).json({
			code: 200,
			success: true,
			project: existingProject,
			message: 'Get detail of project success',
		})
	}),

	//Delete project
	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingProject = await Project.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		await existingProject.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete project success',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { projects } = req.body

		//check array of projects
		if (!Array.isArray(projects) || !projects)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})
		for (let index = 0; index < projects.length; index++) {
			const itemProject = projects[index]
			const existingProject = await Project.findOne({
				where: {
					id: itemProject.id,
				},
			})
			if (existingProject) {
				await existingProject.remove()
			}
		}
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete projects success',
		})
	}),

	//member huy
	checkAssigned: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params

		//Check exist project
		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
			relations: {
				client: true,
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
		const existingUser =
			(await Employee.findOne({
				where: {
					email: decode.email,
				},
			})) ||
			(await Client.findOne({
				where: {
					email: decode.email,
				},
			}))

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		if (
			(existingUser.role === enumRole.EMPLOYEE &&
				existingProject.employees.some(
					(employeeItem) => employeeItem.id === existingUser.id
				)) ||
			existingUser.role === enumRole.ADMIN ||
			(existingUser.role === 'Client' && existingProject.client.email === existingUser.email)
		) {
			return res.status(200).json({
				code: 200,
				success: true,
				message: 'You already signed this project',
			})
		} else {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You not assigned this project',
			})
		}
	}),

	setProjectAdmin: handleCatchError(async (req: Request, res: Response) => {
		const { idProject, idEmployee } = req.body
		if (!idProject || !idEmployee) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You need to enter full field',
			})
		}

		const project = await Project.findOne({
			where: {
				id: Number(idProject),
			},
		})

		const employee = await Employee.findOne({
			where: {
				id: Number(idEmployee),
			},
		})

		if (!project) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This project not exist',
			})
		}

		if (!employee) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This employee not exist',
			})
		}

		project.project_Admin = employee
		await project.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update role successfully',
		})
	}),

	allEmployees: handleCatchError(async (req: Request, res: Response) => {
		const { idProject } = req.params
		if (!idProject) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You need to enter full field',
			})
		}

		const project = await Project.findOne({
			where: {
				id: Number(idProject),
			},
			relations: {
				project_Admin: true,
				employees: true,
			},
		})

		if (!project) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This project not exist',
			})
		}

		const hourly_rate_projects = await Promise.all(
			project.employees.map(async (employee) => {
				return new Promise(async (resolve) => {
					return resolve(
						await Hourly_rate_project.findOne({
							where: {
								project: {
									id: project.id,
								},
								employee: {
									id: employee.id,
								},
							},
						})
					)
				})
			})
		)

		return res.status(200).json({
			code: 200,
			success: true,
			project,
			message: 'get all Employees successfully',
			hourly_rate_projects,
		})
	}),

	deleteEmployee: handleCatchError(async (req: Request, res: Response) => {
		const { projectId, employeeId } = req.body
		const manager = getManager('huprom')

		if (!projectId || !employeeId) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please enter full field',
			})
		}

		const project = await Project.findOne({
			where: {
				id: Number(projectId),
			},
			relations: {
				project_Admin: true,
			},
		})

		if (project?.project_Admin) {
			if (project.project_Admin.id == Number(employeeId)) {
				await manager.query(
					`update project set "projectAdminId" = null where project.id = ${project.id}`
				)
			}
		}

		const dataExist = await manager.query(
			`select * from project_employee where "projectId" = ${Number(
				projectId
			)} and "employeeId" =  ${Number(employeeId)}`
		)
		if (!dataExist || dataExist.length == 0) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This employee is not involved in this project',
			})
		}

		await manager.query(
			`DELETE FROM project_employee WHERE "projectId" = ${Number(
				projectId
			)} and "employeeId" = ${Number(employeeId)}`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete employee successfully',
		})
	}),

	countstatusTasks: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params

		//Check exist project
		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
		})

		if (!existingProject) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This project does not exist in this project',
			})
		}

		const manager = getManager('huprom')
		const countStatusTasks = await manager.query(
			`SELECT status.title, status.color, COUNT(task.id) FROM status LEFT JOIN task on task."statusId" = status.id WHERE status."projectId" = ${projectId} GROUP BY (status.title, status.color)`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			countstatusTasks: countStatusTasks,
			message: 'Get count status tasks successfully',
		})
	}),

	projectEarnings: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params

		//Check exist project
		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
		})

		if (!existingProject) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This project does not exist in this project',
			})
		}

		const manager = getManager('huprom')

		const projectEarnings = await manager.query(
			`SELECT SUM(time_log.earnings) FROM time_log LEFT JOIN project on project.id = time_log."projectId" WHERE project.id = ${projectId} GROUP BY project.id`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			projectEarnings: projectEarnings[0]?.sum ? Number(projectEarnings[0].sum) : 0,
			message: 'Get project earnings successfully',
		})
	}),

	projectHoursLogged: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params

		//Check exist project
		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
		})

		if (!existingProject) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This project does not exist in this project',
			})
		}

		const manager = getManager('huprom')
		const projectHoursLogged = await manager.query(
			`SELECT project.id, SUM(time_log.total_hours) FROM time_log LEFT JOIN project on project.id = time_log."projectId" WHERE project.id = ${projectId} GROUP BY project.id`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			projectHoursLogged: projectHoursLogged[0]?.sum ? Number(projectHoursLogged[0].sum) : 0,
			message: 'Get project hours logged successfully',
		})
	}),

	changeStatus: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params
		const { project_status } = req.body

		if (
			!project_status ||
			project_status !== enumProjectStatus.CANCELED ||
			project_status !== enumProjectStatus.FINISHED ||
			project_status !== enumProjectStatus.IN_PROGRESS ||
			project_status !== enumProjectStatus.NOT_STARTED ||
			project_status !== enumProjectStatus.ON_HOLD
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Input not valid',
			})

		//Check exist project
		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
		})

		if (!existingProject) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This project does not exist in this project',
			})
		}

		//Change status
		existingProject.project_status = project_status
		await existingProject.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Change project status successfully',
		})
	}),

	//Count project status by client
	projectStatusByClient: handleCatchError(async (req: Request, res: Response) => {
		const { clientId } = req.params

		//Check existing client 
		const existingClient = await Client.findOne({
			where: {
				id: Number(clientId)
			}
		})

		if (!existingClient) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client does not exist in this project',
			})
		}

		const manager = getManager('huprom')
		const projectStatus = await manager.query(
			`SELECT project.project_status, COUNT(project.id) from project WHERE project."clientId" = ${existingClient.id} GROUP BY project.project_status`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			countProjectStatus: projectStatus,
			message: 'Get count project status by client successfully',
		})
	}),
}

export default projectController
