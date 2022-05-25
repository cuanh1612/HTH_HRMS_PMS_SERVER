import { Request, Response } from 'express'
import { Employee } from '../entities/Employee'
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
		//Caculate total hours
		if(new Date(starts_on_date) === new Date(ends_on_date)){
			
		}

		//Create time log
		const createdTimeLog = await Time_log.create({
			...dataNewTimeLog,
			project: existingproject,
			task: existingTask,
			employee: existingEmployee,
		}).save()

		//Check existing project
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create new task files success',
			timeLog: createdTimeLog,
		})
	}),

	//update timelog
	update: handleCatchError(async (req: Request, res: Response) =>{
		const { timeLogId} = req.params
		const dataNewTimelog = req.body as createOrUpdatetTimeLogPayload
		const {task, employee} = dataNewTimelog
		
		const messageValid = timeLogValid.createOrUpdate(dataNewTimelog)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//check exist Timelog 

	})
}
export default timeLogController
