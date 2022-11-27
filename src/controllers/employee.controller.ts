import argon2 from 'argon2'
import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { getManager } from 'typeorm'
import { Attendance } from '../entities/Attendance.entity'
import { Avatar } from '../entities/Avatar.entity'
import { Client } from '../entities/Client.entity'
import { Department } from '../entities/Department.entity'
import { Designation } from '../entities/Designation.entity'
import { Employee } from '../entities/Employee.entity'
import { Leave } from '../entities/Leave.entity'
import { Salary } from '../entities/Salary.entity'
import { Task } from '../entities/Task.entity'
import { Time_log } from '../entities/Time_Log.entity'
import { createOrUpdateEmployeePayload } from '../type/EmployeePayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'
import { employeeValid } from '../utils/valid/employeeValid'

const employeeController = {
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const employees = await Employee.find()
		return res.status(200).json({
			code: 200,
			success: true,
			employees: employees,
			message: 'Get all employees successfully',
		})
	}),
	getNormal: handleCatchError(async (_: Request, res: Response) => {
		const employees = await Employee.find({
			select: {
				id: true,
				name: true,
				email: true,
				avatar: {
					url: true,
				},
			},
		})
		return res.status(200).json({
			code: 200,
			success: true,
			employees: employees,
			message: 'Get all employees successfully',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { employeeId } = req.params

		//Check existing employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: Number(employeeId),
			},
			relations: {
				avatar: true
			}
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			employee: existingEmployee,
			message: 'Get detail employee successfully',
		})
	}),

	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewEmployee: createOrUpdateEmployeePayload = req.body

		//Check valid
		const messageValid = employeeValid.createOrUpdate(dataNewEmployee, 'create')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing email
		const existingEmployee =
			(await Employee.findOne({
				where: {
					email: dataNewEmployee.email,
				},
			})) ||
			(await Client.findOne({
				where: {
					email: dataNewEmployee.email,
				},
			}))

		if (existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Email already exists in the system',
			})

		//Check existing department
		if (dataNewEmployee.department) {
			const existingDepartment = await Department.findOne({
				where: {
					id: dataNewEmployee.department,
				},
			})

			if (!existingDepartment)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Department does not exist in the system',
				})
		}

		//Check existing designation
		if (dataNewEmployee.designation) {
			const existingDesignation = await Designation.findOne({
				where: {
					id: dataNewEmployee.designation,
				},
			})

			if (!existingDesignation)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Designation does not exist in the system',
				})
		}

		const hashPassword = await argon2.hash(dataNewEmployee.password)

		//Create new employee
		const newEmployee = Employee.create({
			...dataNewEmployee,
			password: hashPassword,
		})

		const createdEmployee = await newEmployee.save()

		//Create initial salary
		await Salary.create({
			date: new Date(),
			amount: 0,
			employee: createdEmployee,
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			employee: createdEmployee,
			message: 'Created new Employee successfully',
		})
	}),

	importCSV: handleCatchError(async (req: Request, res: Response) => {
		const { employees }: { employees: createOrUpdateEmployeePayload[] } = req.body

		let employeeNotValid: number[] = []
		let employeeExistingEmailOrID: number[] = []
		//employee not have department or designation
		let employeeNotExistDPDS: number[] = []

		await Promise.all(
			employees.map((employee) => {
				return new Promise(async (resolve) => {
					//Check valid
					const messageValid = employeeValid.createOrUpdate(employee, 'create')

					if (messageValid && employee.index) {
						employeeNotValid.push(employee.index)
					} else {
						//Check existing email
						const existingEmployee =
							(await Employee.findOne({
								where: {
									email: employee.email,
								},
							})) ||
							(await Client.findOne({
								where: {
									email: employee.email,
								},
							}))

						//Check existing employee-id
						const existingEmployeeID = await Employee.findOne({
							where: {
								employeeId: employee.employeeId,
							},
						})

						//Check existing department
						const existingDepartment = await Department.findOne({
							where: {
								id: employee.department,
							},
						})

						//Check existing designation
						const existingDesignation = await Designation.findOne({
							where: {
								id: employee.designation,
							},
						})

						if ((existingEmployee || existingEmployeeID) && employee.index) {
							employeeExistingEmailOrID.push(employee.index)
						} else if (
							(!existingDepartment || !existingDesignation) &&
							employee.index
						) {
							employeeNotExistDPDS.push(employee.index)
						} else {
							const hashPassword = await argon2.hash(employee.password)

							//Create new employee
							await Employee.create({
								...employee,
								can_receive_email: true,
								can_login: true,
								password: hashPassword,
							}).save()
						}
					}

					resolve(true)
				})
			})
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: `Create employees by import csv successfully${employeeNotValid.length > 0
				? `. Incorrect lines of data that are not added to the server include index ${employeeNotValid.toString()}`
				: ''
				}${employeeExistingEmailOrID.length > 0
					? `. Employee existing email or employeeID lines of data that are not added to the server include index ${employeeExistingEmailOrID.toString()}`
					: ''
				}${employeeNotExistDPDS.length > 0
					? `. Employee not existing department or designation lines of data that are not added to the server include index ${employeeNotExistDPDS.toString()}`
					: ''
				}`,
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const dataUpdateEmployee: createOrUpdateEmployeePayload = req.body
		const { employeeId } = req.params

		//Check valid
		const messageValid = employeeValid.createOrUpdate(dataUpdateEmployee, 'update')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
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

		const existingUser = await Employee.findOne({
			where: {
				id: decode.userId,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})
		
		//Check if employee edit profile
		if(existingUser.role != "Admin" && !((existingUser.role == "Employee") && (existingUser.id == Number(employeeId)))){
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'No permission to perform this function.',
			})
		}


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

		//Check root
		if (existingEmployee.root === true)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Can not edit account root',
			})

		//Check duplicate email
		const existingEmployeeEmail = await Employee.findOne({
			where: {
				email: dataUpdateEmployee.email,
			},
		})

		const existingClientEmail = await Client.findOne({
			where: {
				email: dataUpdateEmployee.email,
			},
		})

		if (
			existingClientEmail ||
			(existingEmployeeEmail && existingEmployeeEmail.email !== existingEmployee.email)
		) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Email already exist in the system 1',
			})
		}

		//Check existing department
		if (dataUpdateEmployee.department) {
			const existingDepartment = await Department.findOne({
				where: {
					id: dataUpdateEmployee.department,
				},
			})

			if (!existingDepartment)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Department does not exist in the system',
				})
		}

		//Check existing designation
		if (dataUpdateEmployee.designation) {
			const existingDesignation = await Designation.findOne({
				where: {
					id: dataUpdateEmployee.designation,
				},
			})

			if (!existingDesignation)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Designation does not exist in the system',
				})
		}

		//Check exist and update avatar
		const { avatar, ...dataUpdateEmployeeBase } = dataUpdateEmployee
		let newAvatar: Avatar | null = null

		if (avatar) {
			if (existingEmployee.avatar) {
				const existingAvatar = await Avatar.findOne({
					where: {
						id: existingEmployee.avatar.id,
					},
				})

				if (existingAvatar) {
					await Avatar.update(existingAvatar.id, {
						...avatar,
					})
				}
			} else {
				newAvatar = await Avatar.create({
					...avatar,
				}).save()
			}
		}

		const hashPassword = dataUpdateEmployee.password
			? await argon2.hash(dataUpdateEmployee.password)
			: null

		//Update employee
		await Employee.update(
			{
				id: existingEmployee.id,
			},
			{
				...dataUpdateEmployeeBase,
				...(hashPassword ? { password: hashPassword } : {}),
				...(newAvatar
					? {
						avatar: newAvatar,
					}
					: {}),
			}
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated employee successfully',
		})
	}),

	changeRole: handleCatchError(async (req: Request, res: Response) => {
		const { employeeId, role } = req.body

		//Check valid
		const messageValid = employeeValid.changeRole(employeeId, role)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: employeeId,
			},
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		//Check root
		if (existingEmployee.root === true)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Can not change role account root',
			})

		//Update role employee
		existingEmployee.role = role
		await existingEmployee.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated role employee successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
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

		//Check root
		if (existingEmployee.root === true)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Can not delete account root',
			})

		//Delete employee
		await existingEmployee.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete employee successfully',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { employees } = req.body
		if (!employees)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please select many employees to delete',
			})

		for (let index = 0; index < employees.length; index++) {
			const employeeId = employees[index]

			//Check existing employee
			const existingEmployee = await Employee.findOne({
				where: {
					id: Number(employeeId),
				},
			})

			if (existingEmployee && existingEmployee.root === false) {
				//Delete employee
				await existingEmployee.remove()
			}
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete employee successfully',
		})
	}),

	getOpenTasks: handleCatchError(async (req: Request, res: Response) => {
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
				message: 'Not found employee',
			})

		//Get count open task
		const countOpenTask = await getManager('huprom').query(
			`SELECT COUNT(task_employee."employeeId") from task_employee WHERE task_employee."employeeId" = ${employeeId}`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			countOpentasks: Number(countOpenTask[0].count) || 0,
			message: 'Get count open tasks successfully',
		})
	}),

	getCountProjects: handleCatchError(async (req: Request, res: Response) => {
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
				message: 'Not found employee',
			})

		//Get count project assigned
		const countProjects = await getManager('huprom').query(
			`SELECT  COUNT(project_employee."projectId") FROM project_employee WHERE project_employee."employeeId" = ${employeeId}`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			countProjects: Number(countProjects[0].count) || 0,
			message: 'Get count projects successfully',
		})
	}),

	getHoursLogged: handleCatchError(async (req: Request, res: Response) => {
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
				message: 'Not found employee',
			})

		//Get sum logged of employee
		const hoursLogged = await getManager('huprom').query(
			`SELECT  SUM(time_log.total_hours) FROM time_log WHERE time_log."employeeId" = ${employeeId}`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			hoursLogged: Number(hoursLogged[0].sum) || 0,
			message: 'Get hours logged successfully',
		})
	}),

	getLateAttendance: handleCatchError(async (req: Request, res: Response) => {
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
				message: 'Not found employee',
			})

		//Get late attendance
		const lateAttendance = await Attendance.createQueryBuilder('attendance')
			.leftJoinAndSelect('attendance.employee', 'employee')
			.where('employee.id = :employeeId', { employeeId })
			.andWhere('attendance.late = :late', { late: true })
			.getCount()

		return res.status(200).json({
			code: 200,
			success: true,
			lateAttendance,
			message: 'Get late attendance successfully',
		})
	}),

	countLeavesTaken: handleCatchError(async (req: Request, res: Response) => {
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
				message: 'Not found employee',
			})

		//Get countLeavesTaken
		const countLeavesTaken = await Leave.createQueryBuilder('leave')
			.leftJoinAndSelect('leave.employee', 'employee')
			.where('employee.id = :employeeId', { employeeId })
			.getCount()

		return res.status(200).json({
			code: 200,
			success: true,
			countLeavesTaken,
			message: 'Get count leaves taken successfully',
		})
	}),

	countTasksStatus: handleCatchError(async (req: Request, res: Response) => {
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
				message: 'Not found employee',
			})

		//Get sum task by status task
		const countTasksStatus = await getManager('huprom').query(
			`SELECT status.title, COUNT(task.id), status.color FROM status LEFT JOIN task on status.id = task."statusId" LEFT JOIN task_employee on task.id = task_employee."taskId" WHERE task_employee."employeeId" = ${employeeId} GROUP BY (status.title, status.color)`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			countTasksStatus,
			message: 'Get count tasks status successfully',
		})
	}),

	getTasks: handleCatchError(async (req: Request, res: Response) => {
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
				message: 'Not found employee',
			})

		//Get tasks
		const tasks = await Task.find({
			where: {
				employees: {
					id: existingEmployee.id,
				},
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			tasks,
			message: 'Get tasks successfully',
		})
	}),

	getLeaves: handleCatchError(async (req: Request, res: Response) => {
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
				message: 'Not found employee',
			})

		//Get Leaves
		const leaves = await Leave.find({
			where: {
				employee: {
					id: existingEmployee.id,
				},
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			leaves,
			message: 'Get leaves successfully',
		})
	}),

	getTimeLogs: handleCatchError(async (req: Request, res: Response) => {
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
				message: 'Not found employee',
			})

		//Get Time Log
		const timeLogs = await Time_log.find({
			where: {
				employee: {
					id: existingEmployee.id,
				},
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			timeLogs,
			message: 'Get timeLogs successfully',
		})
	}),

	getCountPendingTasks: handleCatchError(async (req: Request, res: Response) => {
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
				message: 'Not found employee',
			})

		//Get count pending task
		const countPendingTasks = await getManager('huprom').query(
			`SELECT COUNT("public"."task"."id") FROM "public"."task_employee" LEFT JOIN "public"."task" on "public"."task_employee"."taskId" = "public"."task"."id" LEFT JOIN "public"."status" ON "public"."status"."id" = "public"."task"."statusId" WHERE "public"."task_employee"."employeeId" = ${employeeId} AND "public"."status"."title" = 'Incomplete' GROUP BY "public"."status"."title"`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			countPendingTasks:
				countPendingTasks && countPendingTasks[0] ? Number(countPendingTasks[0].count) : 0,
			message: 'Get count pending task successfully',
		})
	}),
	getCountCompleteTasks: handleCatchError(async (req: Request, res: Response) => {
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
				message: 'Please select many employees to delete',
			})

		//Get count complete task
		const countCompleteTasks = await getManager('huprom').query(
			`SELECT COUNT("public"."task"."id") FROM "public"."task_employee" LEFT JOIN "public"."task" on "public"."task_employee"."taskId" = "public"."task"."id" LEFT JOIN "public"."status" ON "public"."status"."id" = "public"."task"."statusId" WHERE "public"."task_employee"."employeeId" = ${employeeId} AND "public"."status"."title" = 'Complete' GROUP BY "public"."status"."title"`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			countCompleteTasks:
				countCompleteTasks && countCompleteTasks[0]
					? Number(countCompleteTasks[0].count)
					: 0,
			message: 'Get count complete task successfully',
		})
	}),

	getProject: handleCatchError(async (req: Request, res: Response) => {
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
				message: 'Please select many employees to delete',
			})

		//Get count complete task
		const countCompleteTasks = await getManager('huprom').query(
			`SELECT COUNT("public"."task"."id") FROM "public"."task_employee" LEFT JOIN "public"."task" on "public"."task_employee"."taskId" = "public"."task"."id" LEFT JOIN "public"."status" ON "public"."status"."id" = "public"."task"."statusId" WHERE "public"."task_employee"."employeeId" = ${employeeId} AND "public"."status"."title" = 'Complete' GROUP BY "public"."status"."title"`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			countCompleteTasks: Number(countCompleteTasks[0].count) || 0,
			message: 'Get count complete task successfully',
		})
	}),

	CountStatusProjects: handleCatchError(async (req: Request, res: Response) => {
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
				message: 'Please select many employees to delete',
			})

		//Get count status Projects
		const countStatusProjects = await getManager('huprom').query(
			`SELECT "project"."project_status", COUNT("project"."id") FROM "project_employee" LEFT JOIN "project" ON "project"."id" = "project_employee"."projectId" WHERE "project_employee"."employeeId" = ${employeeId} GROUP BY "project"."project_status"`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			countStatusProjects: countStatusProjects,
			message: 'Get count status projects successfully',
		})
	}),
}

export default employeeController
