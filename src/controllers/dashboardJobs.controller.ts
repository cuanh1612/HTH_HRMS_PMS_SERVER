import { Request, Response } from 'express'
import { getManager } from 'typeorm'
import { Interview } from '../entities/Interview.entity'
import { Job } from '../entities/Job.entity'
import { Job_Application } from '../entities/Job_Application.entity'
import handleCatchError from '../utils/catchAsyncError'

const dashboardJobsController = {
	totalOpenings: handleCatchError(async (_: Request, res: Response) => {
		const total = await Job.createQueryBuilder('job')
			.where('job.status = :status', { status: true })
			.getCount()

		return res.status(200).json({
			code: 200,
			success: true,
			totalOpenings: total,
			message: 'Get total openings successfully',
		})
	}),

	totalApplications: handleCatchError(async (_: Request, res: Response) => {
		const total = await Job_Application.createQueryBuilder('job_application').getCount()

		return res.status(200).json({
			code: 200,
			success: true,
			totalApplications: total,
			message: 'Get total applications successfully',
		})
	}),

	totalHired: handleCatchError(async (_: Request, res: Response) => {
		const total = await Job_Application.createQueryBuilder('job_application')
			.where('job_application.status = :status', { status: 'Hired' })
			.getCount()

		return res.status(200).json({
			code: 200,
			success: true,
			totalHired: total,
			message: 'Get total applications successfully',
		})
	}),

	totalRejected: handleCatchError(async (_: Request, res: Response) => {
		const total = await Job_Application.createQueryBuilder('job_application')
			.where('job_application.status = :status', { status: 'Rejected' })
			.getCount()

		return res.status(200).json({
			code: 200,
			success: true,
			totalRejected: total,
			message: 'Get total applications successfully',
		})
	}),

	todayInterview: handleCatchError(async (_: Request, res: Response) => {
		const data = await Interview.find()

		const total = data.filter((interview) => {
			const interviewDate = new Date(interview.date)
			const dateFilter = new Date()
			return (
				interviewDate.getMonth() == dateFilter.getMonth() &&
				interviewDate.getFullYear() == dateFilter.getFullYear() &&
				interviewDate.getDate() == dateFilter.getDate()
			)
		}).length

		return res.status(200).json({
			code: 200,
			success: true,
			todayInterview: total,
			message: "Get total today's interviews successfully",
		})
	}),

	newInterview: handleCatchError(async (_: Request, res: Response) => {
		const data = await Interview.find()

		const total = data.filter((interview) => {
			const date = new Date().getTime()
			const interviewDate = new Date(interview.date).getTime()
			return interviewDate >= date
		}).length

		return res.status(200).json({
			code: 200,
			success: true,
			newInterview: total,
			message: 'Get total applications successfully',
		})
	}),

	applicationStatus: handleCatchError(async (_: Request, res: Response) => {
		const manager = getManager('huprom')
		const statusApplication = await manager.query(
			'SELECT COUNT(job_application.id), job_application.status FROM job_application GROUP BY job_application.status'
		)

		return res.status(200).json({
			code: 200,
			success: true,
			applicationStatus: statusApplication,
			message: 'Get applications status successfully',
		})
	}),

	applicationSources: handleCatchError(async (_: Request, res: Response) => {
		const manager = getManager('huprom')
		const sourcesApplication = await manager.query(
			'SELECT COUNT(job_application.id), job_application.source FROM job_application GROUP BY job_application.source'
		)

		return res.status(200).json({
			code: 200,
			success: true,
			applicationSources: sourcesApplication,
			message: 'Get application sources successfully',
		})
	}),

	openJobs: handleCatchError(async (_: Request, res: Response) => {
		const data = await Job.find({
			where: {
				status: true,
			},
			relations: {
				recruiter:{
					department: true
				}					
			}
		})

		return res.status(200).json({
			code: 200,
			success: true,
			openJobs: data,
			message: 'Get application sources successfully',
		})
	}),

	todayInterviewCalendar: handleCatchError(async (_: Request, res: Response) => {
		const data = await Interview.find({
			relations: {
				candidate: true
			}
		})

		const result = data.filter((interview) => {
			const interviewDate = new Date(interview.date)
			const dateFilter = new Date()
			return (
				interviewDate.getMonth() == dateFilter.getMonth() &&
				interviewDate.getFullYear() == dateFilter.getFullYear() &&
				interviewDate.getDate() == dateFilter.getDate()
			)
		})

		return res.status(200).json({
			code: 200,
			success: true,
			todayInterview: result,
			message: "Get today's interviews successfully",
		})
	}),
}

export default dashboardJobsController
