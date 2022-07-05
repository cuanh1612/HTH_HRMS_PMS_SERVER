import { Request, Response } from 'express'
import { Employee } from '../entities/Employee'
import { Interview } from '../entities/Interview'
import { Job_Application } from '../entities/Job_Application'
import { createOrUpdateInterviewPayload } from '../type/interview'
import handleCatchError from '../utils/catchAsyncError'

const interviewController = {
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const interviews = await Interview.find({})

		return res.status(200).json({
			code: 200,
			success: true,
			interviews,
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
		}: createOrUpdateInterviewPayload = req.body

		if (!candidate || !interviewer || !date || !start_time) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please enter fullfield',
			})
		}

		const existCandidate = await Job_Application.findOne({
			where: {
				id: candidate,
			},
		})

		if (!existCandidate) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Candidate not exist in system',
			})
		}

		const existInterviewer = await Employee.findOne({
			where: {
				id: interviewer,
			},
		})

		if (!existInterviewer) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Interviewer not exist in system',
			})
		}

		if (!existCandidate) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Candidate not exist in system',
			})
		}

		await Interview.create({
			date: new Date(date),
			comment,
			start_time,
			interviewer: existInterviewer,
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

		if (data.interviewer) {
			const existInterviewer = await Employee.findOne({
				where: {
					id: data.interviewer,
				},
			})
			if (existInterviewer) {
				existInterview.interviewer = existInterviewer
			}
		}

		if (data.start_time) existInterview.start_time = data.start_time
		if (data.comment) existInterview.comment = data.comment
		if (data.date) existInterview.date = new Date(data.date)
		if (data.type) existInterview.type = data.type
		if (data.status) existInterview.status = data.type
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
			}
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

		const handleDl = async (id: number) => {
			const existingInterview = await Interview.findOne({
				where: {
					id: id,
				},
			})
			if (existingInterview) await existingInterview.remove()
		}
		await Promise.all(
			interviews.map((id: number) => {
				return new Promise((resolve) => {
					handleDl(id)
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
}

export default interviewController
