import { Request, Response } from 'express'
import { getManager } from 'typeorm'
import { Attendance } from '../entities/Attendance'
import { Client } from '../entities/Client'
import { Contract } from '../entities/Contract'
import { Employee } from '../entities/Employee'
import { Leave } from '../entities/Leave'
import { Milestone } from '../entities/Milestone'
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

	sumHoursLoggedProjects: handleCatchError(async (_: Request, res: Response) => {
		const manager = getManager('huprom')
		const sumHoursLoggedProjects = await manager.query(
			'SELECT "project"."id", "project"."name", SUM("time_log"."total_hours") from "time_log" LEFT JOIN "project" on "time_log"."projectId" = "project"."id" GROUP BY "project"."id"'
		)

		return res.status(200).json({
			code: 200,
			success: true,
			sumHoursLoggedProjects: sumHoursLoggedProjects,
			message: 'Get sum Hours Logged Projects successfully',
		})
	}),

	sumEarningLoggedProjects: handleCatchError(async (_: Request, res: Response) => {
		const manager = getManager('huprom')
		const sumEarningLoggedProjects = await manager.query(
			'SELECT "project"."id", "project"."name", SUM("time_log"."earnings") from "time_log" LEFT JOIN "project" on "time_log"."projectId" = "project"."id" GROUP BY "project"."id"'
		)

		return res.status(200).json({
			code: 200,
			success: true,
			sumEarningLoggedProjects,
			message: 'Get sum Hours Logged Projects successfully',
		})
	}),

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
		const hoursLogged = await manager.query(
			'SELECT SUM(time_log.total_hours) as sum_total_hours FROM time_log'
		)

		return res.status(200).json({
			code: 200,
			success: true,
			hoursLogged: Number(hoursLogged[0].sum_total_hours) || 0,
			message: 'Get pending leaves successfully',
		})
	}),

	statusWiseProjects: handleCatchError(async (_: Request, res: Response) => {
		const manager = getManager('huprom')
		const statusWiseProjects = await manager.query(
			'SELECT COUNT(project.id), project.project_status FROM project GROUP BY project.project_status'
		)

		return res.status(200).json({
			code: 200,
			success: true,
			statusWiseProjects: statusWiseProjects,
			message: 'Get status wise projects successfully',
		})
	}),

	pendingMilestone: handleCatchError(async (_: Request, res: Response) => {
		const statusWiseProjects = await Milestone.find({
			where: {
				status: false,
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			statusWiseProjects: statusWiseProjects,
			message: 'Get status wise projects successfully',
		})
	}),

	contractsGenerated: handleCatchError(async (_: Request, res: Response) => {
		const contractsGenerated = await Contract.createQueryBuilder('contract').getCount()

		return res.status(200).json({
			code: 200,
			success: true,
			contractsGenerated: contractsGenerated,
			message: 'Get contracts generated successfully',
		})
	}),

	contractsSigned: handleCatchError(async (_: Request, res: Response) => {
		const manager = getManager('huprom')
		const contractsSigned = await manager.query(
			'SELECT COUNT(contract.id) FROM contract WHERE contract."signId" NOTNULL'
		)

		return res.status(200).json({
			code: 200,
			success: true,
			contractsSigned: Number(contractsSigned[0].count) || 0,
			message: 'Get contracts signed successfully',
		})
	}),

	clientWiseEarnings: handleCatchError(async (_: Request, res: Response) => {
		const manager = getManager('huprom')
		const clientWiseEarnings = await manager.query(
			'SELECT SUM(time_log.earnings) as earnings, client.name, client.id FROM time_log, project, client WHERE time_log."projectId" = project.id AND project."clientId" = client.id GROUP BY client.id'
		)

		return res.status(200).json({
			code: 200,
			success: true,
			clientWiseEarnings: clientWiseEarnings,
			message: 'Get client wise earnings successfully',
		})
	}),

	clientWiseTimeLogs: handleCatchError(async (_: Request, res: Response) => {
		const manager = getManager('huprom')
		const clientWiseTimeLogs = await manager.query(
			'SELECT SUM(time_log.total_hours) as total_hours, client.name, client.id FROM time_log, project, client WHERE time_log."projectId" = project.id AND project."clientId" = client.id GROUP BY client.id'
		)

		return res.status(200).json({
			code: 200,
			success: true,
			clientWiseTimeLogs: clientWiseTimeLogs,
			message: 'Get client wise time logs successfully',
		})
	}),

	lastestClients: handleCatchError(async (_: Request, res: Response) => {
		const lastestClients = await Client.createQueryBuilder("client").limit(10).getMany()

		return res.status(200).json({
			code: 200,
			success: true,
			lastestClients: lastestClients,
			message: 'Get lastest clients successfully',
		})
	}),

	lateAttendance: handleCatchError(async (_: Request, res: Response) => {
		const lastestClients = await Client.createQueryBuilder("client").limit(10).getMany()

		return res.status(200).json({
			code: 200,
			success: true,
			lastestClients: lastestClients,
			message: 'Get lastest clients successfully',
		})
	}),
}

export default dashBoardController
