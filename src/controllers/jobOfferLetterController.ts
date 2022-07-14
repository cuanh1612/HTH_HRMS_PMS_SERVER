import { Request, Response } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { Job } from '../entities/Job'
import { Job_Application } from '../entities/Job_Application'
import { Job_offer_letter } from '../entities/Job_Offer_Letter'
import { createOrUpdateJobOfferLetterPayload } from '../type/JobOfferLetterPayload'
import handleCatchError from '../utils/catchAsyncError'
import { jobOfferLetterValid } from '../utils/valid/jobOfferLetterValid'

const jobOfferLetterController = {
	//create new job offer letter
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewJobOfferLetter: createOrUpdateJobOfferLetterPayload = req.body
		const { job, job_application } = dataNewJobOfferLetter

		const messageValid = jobOfferLetterValid.createOrUpdate(dataNewJobOfferLetter)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				succesS: false,
				message: messageValid,
			})

		//check exist jobs
		const existingJobs = await Job.findOne({
			where: {
				id: job,
			},
		})
		if (!existingJobs)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job does not existing in the system',
			})

		//check exist job application
		const existingJobApplication = await Job_Application.findOne({
			where: {
				id: job_application,
			},
		})
		if (!existingJobApplication)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job application does not existing in the system',
			})

		const createJobOfferLetter = await Job_offer_letter.create({
			...dataNewJobOfferLetter,
			expected_joining_date: new Date(dataNewJobOfferLetter.expected_joining_date),
			exprise_on: new Date(dataNewJobOfferLetter.exprise_on),
		}).save()

		const dateToken =
			new Date(dataNewJobOfferLetter.exprise_on).getTime() < new Date().getTime()
				? '24h'
				: `${
						(new Date(dataNewJobOfferLetter.exprise_on).getTime() -
							new Date().getTime()) /
						(1000 * 60 * 60)
				  }h`

		const token = sign(
			{
				id: createJobOfferLetter.id,
			},
			`${process.env.OFFER_TOKEN_SECRET}`,
			{
				expiresIn: dateToken,
			}
		)

		createJobOfferLetter.token = `${token}`
		await createJobOfferLetter.save()

		return res.status(200).json({
			code: 200,
			success: true,
			jobOfferLetter: createJobOfferLetter,
			message: ' Create job application',
		})
	}),

	public: handleCatchError(async (req: Request, res: Response) => {
		const { token } = req.params

		try {
			const { id } = verify(token, `${process.env.OFFER_TOKEN_SECRET}`) as {
				id: string | number
			}
			const jobOfferLetter = await Job_offer_letter.findOne({
				where: {
					id: Number(id),
				},
				relations: {
					job_application: true,
					job: {
						work_experience: true
					},
					sign: true,
				},
			})

			if (!jobOfferLetter)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Contract does not exists in the system',
				})

			return res.status(200).json({
				code: 200,
				success: true,
				jobOfferLetter,
				message: 'Created contract token successfully',
			})
		} catch (error) {
			return res.status(403).json({
				code: 403,
				success: false,
				message: 'You not allow to see',
			})
		}
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
		const existingOffer = await Job_offer_letter.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingOffer) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: status,
			})
		}

		existingOffer.status = status
		await existingOffer.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: "Update job offer letter status successfully",
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateJobOfferLetter: createOrUpdateJobOfferLetterPayload = req.body
		const { job, job_application } = dataUpdateJobOfferLetter

		//check exist job offer letter
		const existingJobOfferLetter = await Job_offer_letter.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingJobOfferLetter)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job offer letter does not exist in the system',
			})

		//check exist job application
		const existingJobApplication = await Job_Application.findOne({
			where: {
				id: Number(job_application),
			},
		})

		if (!existingJobApplication)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job Application does not exist in the system',
			})

		//check exist job
		const existingJob = await Job.findOne({
			where: {
				id: job,
			},
		})
		if (!existingJob)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job does not exisitng in the system',
			})
		;(existingJobOfferLetter.job = dataUpdateJobOfferLetter.job),
			(existingJobOfferLetter.job_application = dataUpdateJobOfferLetter.job_application),
			(existingJobOfferLetter.expected_joining_date = new Date(
				dataUpdateJobOfferLetter.expected_joining_date
			)),
			(existingJobOfferLetter.exprise_on = new Date(dataUpdateJobOfferLetter.exprise_on)),
			(existingJobOfferLetter.salary = dataUpdateJobOfferLetter.salary),
			(existingJobOfferLetter.rate = dataUpdateJobOfferLetter.rate)

		if (dataUpdateJobOfferLetter.status) {
			existingJobOfferLetter.status = dataUpdateJobOfferLetter.status
		}

		await existingJobOfferLetter.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update job offer letter success',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingJobOfferLetter = await Job_offer_letter.findOne({
			where: {
				id: Number(id),
			},
			relations: {
				job: {
					work_experience: true,
				},
				job_application: true,
			},
		})
		if (!existingJobOfferLetter)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This job offer letter does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			jobOfferLetter: existingJobOfferLetter,
			message: 'Get detail of job offer letter success',
		})
	}),

	getAll: handleCatchError(async (_, res: Response) => {
		const jobOfferLetters = await Job_offer_letter.find({
			relations: {
				job_application: true,
				job: true,
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			jobOfferLetters,
			message: 'Get all job offer letters success',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingJobOfferLetter = await Job_offer_letter.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingJobOfferLetter)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This job offer letter does not exist in the system',
			})

		//Delete job offer letter
		await existingJobOfferLetter.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'delete job offer letter success',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { jobOfferLetters } = req.body

		//check array of job offer letters
		if (!Array.isArray(jobOfferLetters))
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please select job offer letter to delete many',
			})

	
		await Promise.all(
			jobOfferLetters.map(async (id: number) => {
				return new Promise(async (resolve) => {
					const existingJobOfferLetter = await Job_offer_letter.findOne({
						where: {
							id,
						},
					})
					if (existingJobOfferLetter) {
						//Delete job offer letter
						await Job_offer_letter.remove(existingJobOfferLetter)
					}
					resolve(true)
				})
			})
		)
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete job offer letters success',
		})
	}),

	getByJob: handleCatchError(async (req: Request, res: Response) => {
		const { JobId } = req.params

		const existingJob = await Job.findOne({
			where: {
				id: Number(JobId),
			},
		})

		if (!existingJob)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job does not existing in the system',
			})

		const jobOfferLettersByJob = await Job_offer_letter.find({
			where: {
				job: {
					id: Number(JobId),
				},
			},
		})

		if (!jobOfferLettersByJob)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job offer letters does not existing in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			jobOfferLettersByJob,
			message: 'Get job offer letters by job success',
		})
	}),
}

export default jobOfferLetterController
