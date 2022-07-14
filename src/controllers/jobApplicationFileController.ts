import { Request, Response } from 'express'
import { Job_Application } from '../entities/Job_Application'
import { Job_application_file } from '../entities/Job_Application_File'
import { createOrUpdateJobApplicationFilesPayload } from '../type/jobApplicationFilePayLoad'
import handleCatchError from '../utils/catchAsyncError'

const jobApplicationFileController = {
	create: handleCatchError(async (req: Request, res: Response) => {
		const { jobApplication, files } = req.body as createOrUpdateJobApplicationFilesPayload

		//check exist job application
		const existingJobApplication = await Job_Application.findOne({
			where: {
				id: jobApplication,
			},
		})
		if (!existingJobApplication)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This job application does not exist in the system',
			})
		if (Array.isArray(files)) {
			files.map(async (file) => {
				await Job_application_file.create({
					...file,
					job_application: existingJobApplication,
				}).save()
			})
		}
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create new job application files success',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { jobApplicationFileId, jobApplicationId } = req.params

		const existingJobApplication = await Job_Application.findOne({
			where: {
				id: Number(jobApplicationId),
			},
		})
		if (!existingJobApplication)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This job application does not existing in the system',
			})

		//check existing job application file
		const existingJobApplicationFile = await Job_application_file.findOne({
			where: {
				id: Number(jobApplicationFileId),
				job_application: {
					id: Number(jobApplicationId),
				},
			},
		})
		if (!existingJobApplicationFile)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This job application file does not existing in the system',
			})

		//delete job application file
		await existingJobApplicationFile.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete job application file success',
		})
	}),
	getAll: handleCatchError(async (req: Request, res: Response) => {
		const { jobApplicationId } = req.params

		//Check exist job application
		const existingJobApplication = await Job_Application.findOne({
			where: {
				id: Number(jobApplicationId),
			},
		})

		if (!existingJobApplication)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job application does not exist in the system',
			})

		//Get all job Application file
		const jobApplicationFiles = await Job_application_file.find({
			where: {
				job_application: {
					id: Number(jobApplicationId),
				},
			},
			order: {
				createdAt: 'DESC',
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			jobApplicationFiles,
			message: 'Get all job application files success successfully',
		})
	}),
}
export default jobApplicationFileController
