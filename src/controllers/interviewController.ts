import { Request, Response } from 'express'
import { Employee } from '../entities/Employee'
import { Interview } from '../entities/Interview'
import { Job } from '../entities/Job'
import { Job_Application } from '../entities/Job_Application'
import { createOrUpdateInterviewPayload } from '../type/interview'
import handleCatchError from '../utils/catchAsyncError'
import sendMail from '../utils/sendNotice'
import { templateInterview } from '../utils/templateEmail'

const interviewController = {
	getAll: handleCatchError(async (req: Request, res: Response) => {
		const { date, interviewer, status } = req.query
		var filter: {
			status?: string
			interviewer?: {
				id: number
			}
		} = {}
		if (status) filter.status = String(status)
		if (interviewer)
			filter.interviewer = {
				id: Number(interviewer),
			}

		var interviews = await Interview.find({
			relations: {
				candidate: true,
				interviewer: true,
			},
			where: filter,
		})

		if (date) {
			interviews = interviews.filter((interview) => {
				const interviewDate = new Date(interview.date)
				const dateFilter = new Date(date as string)
				return (
					interviewDate.getMonth() <= dateFilter.getMonth() &&
					interviewDate.getFullYear() <= dateFilter.getFullYear()
				)
			})
		}

		return res.status(200).json({
			code: 200,
			success: true,
			interviews,
			message: 'Get all Events successfully',
		})
	}),

	getNewByDate: handleCatchError(async (_: Request, res: Response) => {
		const interviews = await Interview.find({
			relations: {
				candidate: {
					jobs: true,
				},
				interviewer: true,
			},
		})

		const data = interviews.filter((interview) => {
			const date = new Date().getTime()
			const interviewDate = new Date(interview.date).getTime()

			return interviewDate >= date
		})

		return res.status(200).json({
			code: 200,
			success: true,
			interviews: data,
			message: 'Get all Events successfully',
		})
	}),

	create: handleCatchError(async (req: Request, res: Response) => {
		const {
			candidate,
			date,
			comment,
			interviewer,
			type,
			start_time,
			isSendReminder,
		}: createOrUpdateInterviewPayload = req.body

		const listValidInterviewer: Employee[] = []

		if (!candidate || !interviewer || !date || !start_time) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please enter full field',
			})
		}

		if (!Array.isArray(interviewer) || interviewer.length === 0) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please select interviewer',
			})
		}

		const existCandidate = await Job_Application.findOne({
			where: {
				id: candidate,
			},
			relations: {
				jobs: true
			}
		})

		if (!existCandidate) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Candidate not exist in system',
			})
		}

		if (!existCandidate) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Candidate not exist in system',
			})
		}

		//Check exisit interviewer
		await Promise.all(
			interviewer.map(async (interviewId: number) => {
				return new Promise(async (resolve) => {
					const existingInterviewer = await Employee.findOne({
						where: {
							id: interviewId,
						},
					})

					if (!existingInterviewer) {
						return res.status(400).json({
							code: 400,
							success: false,
							message: 'Please select valid interviewer',
						})
					}

					listValidInterviewer.push(existingInterviewer)

					return resolve(true)
				})
			})
		)
	
		templateInterview({
			name: existCandidate.name,
			file: '../../views/interview.handlebars',
			position: existCandidate.jobs.title,
			time: `${start_time}, ${new Date(date).toLocaleDateString('es-CL')}`
		})
		if (isSendReminder) {
			await sendMail({
				to: `${existCandidate.email}`,
				subject: 'huprom - interview',
				text: 'Interview',
				template: 'interview'
			})
		}

		await Interview.create({
			date: new Date(date),
			comment,
			start_time,
			interviewer: listValidInterviewer,
			candidate: existCandidate,
			type,
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create interview successfully',
		})
	}),

	updateStatus: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const { status } = req.body
		if (!id) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please enter full field',
			})
		}
		const existingInterview = await Interview.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingInterview) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This interview not exist in system',
			})
		}

		existingInterview.status = status
		await existingInterview.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update status successfully',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const data: createOrUpdateInterviewPayload = req.body
		const { interviewer } = data
		const { id } = req.params

		const listValidInterviewer: Employee[] = []

		const existInterview = await Interview.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existInterview) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Interview not exist in system',
			})
		}

		if (data.candidate) {
			const existCandidate = await Job_Application.findOne({
				where: {
					id: data.candidate,
				},
			})
			if (existCandidate) {
				existInterview.candidate = existCandidate
			}
		}

		//Check exisit interviewer
		await Promise.all(
			interviewer.map(async (interviewId: number) => {
				return new Promise(async (resolve) => {
					const existingInterviewer = await Employee.findOne({
						where: {
							id: interviewId,
						},
					})

					if (!existingInterviewer) {
						return res.status(400).json({
							code: 400,
							success: false,
							message: 'Please select valid interviewer',
						})
					}

					listValidInterviewer.push(existingInterviewer)
					return resolve(true)
				})
			})
		)
		existInterview.interviewer = listValidInterviewer
		if (data.start_time) existInterview.start_time = data.start_time
		if (data.comment) existInterview.comment = data.comment
		if (data.date) existInterview.date = new Date(data.date)
		if (data.type) existInterview.type = data.type
		if (data.status) existInterview.status = data.status
		await existInterview.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update interview successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existInterview = await Interview.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existInterview) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Interview not exist in system',
			})
		}

		await existInterview.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete interview successfully',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingInterview = await Interview.findOne({
			where: {
				id: Number(id),
			},
			relations: {
				candidate: {
					jobs: true,
				},
				interviewer: true,
			},
		})

		if (!existingInterview)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Interview does not existing in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			interview: existingInterview,
			message: 'Get detail of job success',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { interviews } = req.body

		//check array of job
		if (!Array.isArray(interviews))
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Interviews does not existing in the system',
			})

		await Promise.all(
			interviews.map(async (id: number) => {
				return new Promise(async (resolve) => {
					const existingInterview = await Interview.findOne({
						where: {
							id: id,
						},
					})
					if (existingInterview) await existingInterview.remove()
					resolve(true)
				})
			})
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete jobs success',
		})
	}),

	getByJob: handleCatchError(async (req: Request, res: Response) => {
		const { jobId } = req.params

		//Check exist job
		const existingJob = await Job.findOne({
			where: {
				id: Number(jobId),
			},
		})

		if (!existingJob)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job does not existing in the system',
			})

		//Get interviews by job
		const interviews = await Interview.find({
			where: {
				candidate: {
					jobs: {
						id: existingJob.id,
					},
				},
			},
			relations: {
				candidate: true,
				interviewer: true,
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			interviews,
			message: 'Get interviews by job successfully',
		})
	}),
}

export default interviewController
