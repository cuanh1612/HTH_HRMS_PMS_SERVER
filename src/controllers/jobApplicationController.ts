import handleCatchError from '../utils/catchAsyncError'
import { Request, Response } from 'express'
import { jobApplicationValid } from '../utils/valid/jobApplicationValid'
import { Job } from '../entities/Job'
import { Location } from '../entities/Location'
import { Job_Application } from '../entities/Job_Application'
import { createOrUpdateJobApplicationPayload } from '../type/JobApplicationPayload'
import { Job_application_picture } from '../entities/Job_Application_Picture'

const jobApplicationController = {
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
		const existingJob = await Job_Application.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingJob) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This job application not exist in system',
			})
		}

		existingJob.status = status
		await existingJob.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update status successfully ',
		})
	}),
	//create new job application
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewJobApplication: createOrUpdateJobApplicationPayload = req.body
		const { jobs, location } = dataNewJobApplication

		const messageValid = jobApplicationValid.createOrUpdate(dataNewJobApplication)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				succesS: false,
				message: messageValid,
			})

		//check exist jobs
		const existingJobs = await Job.findOne({
			where: {
				id: jobs,
			},
		})
		if (!existingJobs)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job does not exisitng in the system',
			})
		//check exist location
		const existingLocation = await Location.findOne({
			where: {
				id: location,
			},
		})
		if (!existingLocation)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Location does not exisitng in the system',
			})

		const createJobApplication = await Job_Application.create({
			...dataNewJobApplication,
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			job_application: createJobApplication,
			message: ' Create job application',
		})
	}),
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const datatUpdateJobApplication: createOrUpdateJobApplicationPayload = req.body
		const { location, jobs, picture } = datatUpdateJobApplication

		//check exist job application
		const existingJobApplication = await Job_Application.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingJobApplication)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job Application does not exist in the system',
			})

		//check exist jobs
		const existingJobs = await Job.findOne({
			where: {
				id: jobs,
			},
		})
		if (!existingJobs)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job does not exisitng in the system',
			})
		//check exist location
		const existingLocation = await Location.findOne({
			where: {
				id: location,
			},
		})
		if (!existingLocation)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Location does not exisitng in the system',
			})

		//Delete old picture
		const oldPictureId = existingJobApplication.picture.id || undefined

		;(existingJobApplication.name = datatUpdateJobApplication.name),
			(existingJobApplication.email = datatUpdateJobApplication.email),
			(existingJobApplication.jobs = datatUpdateJobApplication.jobs),
			(existingJobApplication.location = datatUpdateJobApplication.location),
			(existingJobApplication.mobile = datatUpdateJobApplication.mobile),
			(existingJobApplication.picture = datatUpdateJobApplication.picture),
			(existingJobApplication.cover_leter = datatUpdateJobApplication.cover_leter),
			(existingJobApplication.status = datatUpdateJobApplication.status),
			(existingJobApplication.source = datatUpdateJobApplication.source)

		await existingJobApplication.save()

		if (picture) {
			const existingJobApplicationpicture = await Job_application_picture.findOne({
				where: {
					id: oldPictureId,
				},
			})

			if (existingJobApplicationpicture) {
				await existingJobApplicationpicture.remove()
			}
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update job application success',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingJobApplication = await Job_Application.findOne({
			where: {
				id: Number(id),
			},
			relations: {
				jobs: true,
				location: true,
			},
		})
		if (!existingJobApplication)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This job application does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			jobApplication: existingJobApplication,
			message: 'Get detail of job application success',
		})
	}),

	getAll: handleCatchError(async (_, res: Response) => {
		const jobApplications = await Job_Application.find({
			relations: {
				location: true,
				jobs: true,
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			jobApplications,
			message: 'Get all job application success',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingJobApplication = await Job_Application.findOne({
			where: {
				id: Number(id),
			},
		})
		if (!existingJobApplication)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This job application does not exist in the system',
			})

		//Delete picture job application
		const pictureId = existingJobApplication.picture.id || undefined

		//Delete job application
		await existingJobApplication.remove()

		if (pictureId) {
			const existingJobApplicationpicture = await Job_application_picture.findOne({
				where: {
					id: pictureId,
				},
			})

			if (existingJobApplicationpicture) {
				await existingJobApplicationpicture.remove()
			}
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'delete job application success',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { jobApplications } = req.body
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log('nguyen quang hoang')
		console.log(jobApplications)
		//check array of job applications
		if (!Array.isArray(jobApplications))
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'job application does not existing in the system',
			})

		await Promise.all(
			jobApplications.map(async (id: number) => {
				return new Promise(async (resolve) => {
					const existingJobApplication = await Job_Application.findOne({
						where: {
							id: id,
						},
					})
					if (existingJobApplication) {
						//Delete picture job application
						const pictureId = existingJobApplication.picture? existingJobApplication.picture.id : undefined

						//Delete job application
						await Job_Application.remove(existingJobApplication)

						if (pictureId) {
							const existingJobApplicationpicture =
								await Job_application_picture.findOne({
									where: {
										id: pictureId,
									},
								})

							if (existingJobApplicationpicture) {
								await existingJobApplicationpicture.remove()
							}
						}
					}
					resolve(true)
				})
			})
		)
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete job applications success',
		})
	}),

	changeStatusMany: handleCatchError(async (req: Request, res: Response) => {
		const { job_applications } = req.body
		const { status } = req.body

		//check array of job applications
		if (!Array.isArray(job_applications || job_applications))
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'job application does not existing in the system',
			})

		await Promise.all(
			job_applications.map(async (id: number) => {
				return new Promise(async (resolve) => {
					const existingJobApplication = await Job_Application.findOne({
						where: {
							id: id,
						},
					})
					if (existingJobApplication) {
						existingJobApplication.status = status
					}
					await existingJobApplication?.save()
					resolve(true)
				})
			})
		)
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'change status job applications success',
		})
	}),
}

export default jobApplicationController
