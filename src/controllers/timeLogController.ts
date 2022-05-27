import { Request, Response } from 'express'
import { Employee } from '../entities/Employee'
import { Hourly_rate_project } from '../entities/Hourly_rate_project'
import { Project } from '../entities/Project'
import { Task } from '../entities/Task'
import { Time_log } from '../entities/Time_Log'
import { createOrUpdatetTimeLogPayload } from '../type/TimeLogPayload'
import handleCatchError from '../utils/catchAsyncError'
import { timeLogValid } from '../utils/valid/timeLogValid'

const timeLogController = {
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewTimeLog = req.body as createOrUpdatetTimeLogPayload
		const { project, task, employee, starts_on_date, ends_on_date } = dataNewTimeLog

		//Check valid input create new project
		//Check valid
		const messageValid = timeLogValid.createOrUpdate(dataNewTimeLog)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
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

		//Check exisiting task
		const existingTask = await Task.findOne({
			where: {
				id: task,
			},
			relations: {
				employees: true,
			},
		})

		if (!existingTask)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Task does not exist in the system',
			})

		//Check exisiting employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: employee,
			},
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		//Check employee  assign to task and project
		if (
			!existingproject.employees.some(
				(employeeItem) => employeeItem.id === existingEmployee.id
			) ||
			!existingproject.employees.some(
				(employeeItem) => employeeItem.id === existingEmployee.id
			)
		) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not assigned to task or project',
			})
		}

		//Create time log
		const newTimeLog = await Time_log.create({
			...dataNewTimeLog,
			project: existingproject,
			task: existingTask,
			employee: existingEmployee,
		}).save()

		//Get time log created
		const createdTimeLog = (await Time_log.findOne({
			where: {
				id: newTimeLog.id,
			},
		})) as Time_log

		//Get total hourse
		const dateOneObj = new Date(starts_on_date)
		const dateTwoObj = new Date(ends_on_date)
		const dateOneObjTime = new Date(
			`${dateOneObj.getMonth() + 1}-${dateOneObj.getDate()}-${dateOneObj.getFullYear()} ${
				createdTimeLog.starts_on_time
			}`
		)
		const dateTwoObjTime = new Date(
			`${dateTwoObj.getMonth() + 1}-${dateTwoObj.getDate()}-${dateTwoObj.getFullYear()} ${
				createdTimeLog.ends_on_time
			}`
		)
		const milliseconds = Math.abs(dateTwoObjTime.getTime() - dateOneObjTime.getTime())
		const totalHours = Math.round(milliseconds / 1000 / 3600)

		//Update total hours
		createdTimeLog.total_hours = totalHours

		//Get total earning
		const exisingHourlyrate = await Hourly_rate_project.findOne({
			where: {
				employee: {
					id: existingEmployee.id,
				},
				project: {
					id: existingproject.id,
				},
			},
		})

		if (exisingHourlyrate) {
			createdTimeLog.earnings = exisingHourlyrate.hourly_rate * totalHours
		}

		//Save update earning
		await createdTimeLog.save()

		//Check existing project
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create new task files success',
			// timeLog: createdTimeLog,
		})
	}),

	//update timelog
	update: handleCatchError(async (req: Request, res: Response) => {
		const { timeLogId } = req.params
		const dataUpdateTimeLog = req.body as createOrUpdatetTimeLogPayload
		const {
			project,
			task,
			employee,
			starts_on_date,
			ends_on_date,
			starts_on_time,
			ends_on_time,
		} = dataUpdateTimeLog

		//Check valid input create new project
		const messageValid = timeLogValid.createOrUpdate(dataUpdateTimeLog)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
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

		//Check exisiting task
		const existingTask = await Task.findOne({
			where: {
				id: task,
			},
			relations: {
				employees: true,
			},
		})

		if (!existingTask)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Task does not exist in the system',
			})

		//Check exisiting employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: employee,
			},
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		//Check employee  assign to task and project
		if (
			!existingproject.employees.some(
				(employeeItem) => employeeItem.id === existingEmployee.id
			) ||
			!existingproject.employees.some(
				(employeeItem) => employeeItem.id === existingEmployee.id
			)
		) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not assigned to task or project',
			})
		}
		//Check existing time log
		const existingTimeLog = await Time_log.findOne({
			where: {
				id: Number(timeLogId),
			},
		})

		if (!existingTimeLog)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Time log does not exist in the system',
			})

		existingTimeLog.starts_on_time = starts_on_time
		existingTimeLog.ends_on_time = ends_on_time
		await existingTimeLog.save()

		//Get time log after update
		const updatedTimeLog = (await Time_log.findOne({
			where: {
				id: Number(timeLogId),
			},
		})) as Time_log

		//Get total hourse
		const dateOneObj = new Date(starts_on_date)
		const dateTwoObj = new Date(ends_on_date)
		const dateOneObjTime = new Date(
			`${dateOneObj.getMonth() + 1}-${dateOneObj.getDate()}-${dateOneObj.getFullYear()} ${
				updatedTimeLog.starts_on_time
			}`
		)
		const dateTwoObjTime = new Date(
			`${dateTwoObj.getMonth() + 1}-${dateTwoObj.getDate()}-${dateTwoObj.getFullYear()} ${
				updatedTimeLog.ends_on_time
			}`
		)
		const milliseconds = Math.abs(dateTwoObjTime.getTime() - dateOneObjTime.getTime())
		const totalHours = Math.round(milliseconds / 1000 / 3600)

		//Update total hours
		updatedTimeLog.total_hours = totalHours

		//Get total earning
		const exisingHourlyrate = await Hourly_rate_project.findOne({
			where: {
				employee: {
					id: existingEmployee.id,
				},
				project: {
					id: existingproject.id,
				},
			},
		})

		if (exisingHourlyrate) {
			updatedTimeLog.earnings = exisingHourlyrate.hourly_rate * totalHours
		}

		updatedTimeLog.project = existingproject
		updatedTimeLog.task = task
		updatedTimeLog.memo = dataUpdateTimeLog.memo
		updatedTimeLog.employee = existingEmployee

		//Save update
		await updatedTimeLog.save()

		//Check existing project
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated time log successfully',
		})
	}),

	//delete timelog
	delete: handleCatchError(async (req: Request, res: Response) => {
		const { timeLogId } = req.params

		//Check existing timelog
		const existingTimeLog = await Time_log.findOne({
			where: {
				id: Number(timeLogId),
			},
		})

		if (!existingTimeLog)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Time log does not assigned to task or project',
			})

		//Delete
		await existingTimeLog.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Deleted time log successfully',
		})
	}),

	getAllByProject: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params // taik biet tieenngs

		//Check exist project
		const existingproject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
		})

		if (!existingproject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		const timeLogs = await Time_log.find({
			where: {
				project: {
					id: existingproject.id,
				},
			},
			order: {
				createdAt: 'DESC',
			},
			relations: {
				task: {
					status: true
				},
				employee: true,
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			timeLogs,
			message: 'Deleted time log successfully',
		})
	}),
	
	Deletemany: handleCatchError(async (req: Request, res: Response) => {
		const { timelogs } = req.body

		//check array of timelog
		if (!Array.isArray(timelogs) || !timelogs)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Timelog does not exist in the system',
			})
		for (let index = 0; index < timelogs.length; index++) {
			const itemtimelog = timelogs[index]
			const existingtimelog = await Time_log.findOne({
				where: {
					id: itemtimelog.id,
				},
			})
			if (existingtimelog) {
				await existingtimelog.remove()
			}
		}
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete timelogs success',
		})
	}),

	getAll: handleCatchError(async (_: Request, res: Response) => {
		const timelogs = await Time_log.find()

		return res.status(200).json({
			code: 200,
			success: true,
			timelogs: timelogs,
			message: 'Get all timelog success',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { timelogId } = req.params

		const existingtimelog = await Time_log.findOne({
			where: {
				id: Number(timelogId),
			},
			relations: {
				project: true,
				employee: true,
				task: true,
			},
		})
		if (!existingtimelog)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Timelog does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			timeLog: existingtimelog,
			message: 'Get detail of timelog success',
		})
	}),
}
export default timeLogController
