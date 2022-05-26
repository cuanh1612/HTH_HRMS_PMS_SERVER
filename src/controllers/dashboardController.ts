import { Request, Response } from 'express'
import { getManager } from 'typeorm'
import { Attendance } from '../entities/Attendance'
import { Client } from '../entities/Client'
import { Employee } from '../entities/Employee'
import { Leave } from '../entities/Leave'
import { Project } from '../entities/Project'
import { Task } from '../entities/Task'
import handleCatchError from '../utils/catchAsyncError'

const dashBoardController = {
	totalClients: handleCatchError(async (_: Request, res: Response) => {
		const totalClients = await Client.createQueryBuilder('client').getCount()
		return res.status(200).json({
			code: 200,
			success: true,
			totalClients,
			message: 'Get total clients successfully',
		})
	}),

	totalEmployees: handleCatchError(async (_: Request, res: Response) => {
		const totalEmployees = await Employee.createQueryBuilder('employee').getCount()
		return res.status(200).json({
			code: 200,
			success: true,
			totalEmployees,
			message: 'Get total employees successfully',
		})
	}),

	totalProjects: handleCatchError(async (_: Request, res: Response) => {
		const totalProjects = await Project.createQueryBuilder('project').getCount()

		return res.status(200).json({
			code: 200,
			success: true,
			totalProjects,
			message: 'Get total projects successfully',
		})
	}),

	// hoursLogged: handleCatchError(async (_: Request, res: Response) => {
	// 	const hoursLogged = await Project.createQueryBuilder('project').getCount()

	// 	return res.status(200).json({
	// 		code: 200,
	// 		success: true,
	// 		hoursLogged,
	// 		message: 'Get hours logged successfully',
	// 	})
	// }),

	pendingTasks: handleCatchError(async (_: Request, res: Response) => {
		const pendingTasks = await Task.createQueryBuilder('task')
			.leftJoinAndSelect('task.status', 'status')
			.where('status.title != :title', { title: 'Complete' })
			.getCount()

		return res.status(200).json({
			code: 200,
			success: true,
			pendingTasks,
			message: 'Get pending tasks successfully',
		})
	}),

	todayAttendance: handleCatchError(async (_: Request, res: Response) => {
		const todayAttendance = await Attendance.createQueryBuilder('attendance')
			.where('attendance.date = :date', { date: new Date().toLocaleDateString() })
			.getCount()

		return res.status(200).json({
			code: 200,
			success: true,
			todayAttendance,
			message: 'Get today attendance successfully',
		})
	}),

	pendingTasksRaw: handleCatchError(async (_: Request, res: Response) => {
		const pendingTasksRaw = await Task.createQueryBuilder('task')
			.leftJoinAndSelect('task.status', 'status')
			.where('status.title != :title', { title: 'Complete' })
			.getMany()

		return res.status(200).json({
			code: 200,
			success: true,
			pendingTasksRaw,
			message: 'Get pending tasks successfully',
		})
	}),

	pendingLeavesRaw: handleCatchError(async (_: Request, res: Response) => {
		const pendingLeavesRaw = await Leave.createQueryBuilder('leave')
			.where('leave.status != :status', { status: 'Pending' })
			.getMany()

		return res.status(200).json({
			code: 200,
			success: true,
			pendingLeavesRaw,
			message: 'Get pending leaves successfully',
		})
	}),

	hoursLogged: handleCatchError(async (_: Request, res: Response) => {
		const manager = getManager('huprom')
		const hoursLogged =
			(await manager.query(
				'SELECT SUM(time_log.total_hours) as sum_total_hours FROM time_log'
			)) || 0

		return res.status(200).json({
			code: 200,
			success: true,
			hoursLogged: Number(hoursLogged[0].sum_total_hours) || 0,
			message: 'Get pending leaves successfully',
		})
	}),
}

export default dashBoardController
