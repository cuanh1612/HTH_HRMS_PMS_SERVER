import { Request, Response } from 'express'
import { Attendance } from '../entities/Attendance'
import { Client } from '../entities/Client'
import { Employee } from '../entities/Employee'
import { Leave } from '../entities/Leave'
import { Project } from '../entities/Project'
import { Task } from '../entities/Task'
import handleCatchError from '../utils/catchAsyncError'

const dashBoardController = {
	overview: handleCatchError(async (_: Request, res: Response) => {
		const countClients = await Client.createQueryBuilder('client').getCount()
		const countEmployees = await Employee.createQueryBuilder('employee').getCount()
		const countProjects = await Project.createQueryBuilder('project').getCount()
		const countAttendancesToday = await Attendance.createQueryBuilder('attendance')
			.where('attendance.date = :date', {
				date: new Date(),
			})
			.getCount()
		const pendingLeaves = await Leave.find({
			where: {
				status: 'Pending',
			},
		})
		const pendingTasks = await Task.find({
			where: {
				status: 'Incomplete' || 'To Do' || 'Doing' || 'Completed',
			},
		})

		const overview = {
			countClients,
			countEmployees,
			countProjects,
			countAttendancesToday,
			pendingLeaves,
			pendingTasks,
		}

		return res.status(200).json({
			code: 200,
			success: true,
			overview,
			message: 'Get overview dashboard successfully',
		})
	}),

	project: handleCatchError(async (_: Request, res: Response) => {
		const countProjects = await Project.createQueryBuilder('project').getCount()
		const countOverdueProjects = await Project.createQueryBuilder('project')
			.where('project.project_status = :project_status', {
				project_status: 'Not Started' || 'In Progress' || 'On Hold' || 'Canceled',
			})
			.getCount()

		const dashboardProject = {
			countProjects,
			countOverdueProjects,
		}

		return res.status(200).json({
			code: 200,
			success: true,
			dashboardProject,
			message: 'Get project dashboard successfully',
		})
	}),
}

export default dashBoardController
