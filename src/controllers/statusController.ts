import { Request, Response } from 'express'
import { Project } from '../entities/Project'
import { Status } from '../entities/Status'
import { createOrUpdateStatusPayload } from '../type/statusPayload'
import handleCatchError from '../utils/catchAsyncError'
import { statusValid } from '../utils/valid/statusValid'

const statusController = {
	//create new status
	create: handleCatchError(async (req: Request, res: Response) => {
		const { project, title, color } = req.body

		if( !project || !title || !color) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please enter full field',
			})
		}

		const laststatus = await Status.findOne({
			where: {
				project: {
					id: project,
				},
			},
			order: {
				index: 'DESC',
			},
		})

		if (!laststatus)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Status does not exist in the system',
			})

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

		const status_result = await Status.create({
			project: existingproject,
			title: title,
			color: color,
			index: laststatus.index + 1,
		}).save()

	

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create status success',
			result: status_result,
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params	

		const existingStatus = await Status.findOne({
			where: {
				id: Number(id)
			}
		})

		if(!existingStatus)
		return res.status(400).json({
			code: 400,
			success: false,
			message: 'Status does not exist in the system',
		})

		return res.status(200).json({
			code: 200,
			success: true,
			project: existingStatus,
			message: 'Get detail of project success',
		})
	}),

	//get all status by project
	getAll: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params

		const findbyproject = await Status.find({
			where: {
				project: {
					id: Number(projectId),
				},
			},
			
		})

		if (!findbyproject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			statuses: findbyproject,
			message: 'Get all status success',
		})
	}),

	//get all status by project (with task)
	getAllWithTask: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params

		const findbyproject = await Status.find({
			where: {
				project: {
					id: Number(projectId),
				},
			},
			relations: {
				tasks: {
					employees: true
				},
			},
			order: {
				index: 'ASC',
				tasks: {
					index: 'ASC',
				},
			},
		})

		if (!findbyproject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			statuses: findbyproject,
			message: 'Get all status success',
		})
	}),

	//Update status
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateStatus: createOrUpdateStatusPayload = req.body

		const existingstatus = await Status.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingstatus)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'status does not existing in the system',
			})

		const messageValid = statusValid.createOrUpdate(existingstatus, 'update')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})
		;(existingstatus.title = dataUpdateStatus.title),
			(existingstatus.color = dataUpdateStatus.color)

		await existingstatus.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update Status success',
		})
	}),

	//Delete status
	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingstatus = await Status.findOne({
			where: {
				id: Number(id),
			},
		})
		if (!existingstatus)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'status does not existing in the system',
			})

		const messageValid = statusValid.createOrUpdate(existingstatus, 'update')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		existingstatus.remove()
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete status success',
		})
	}),

	//Change position of status
	changeposition: handleCatchError(async (req: Request, res: Response) => {
		const { id1, id2, projectId } = req.body

		const status1 = await Status.createQueryBuilder('status')
			.where('status.id = :id1', { id1 })
			.getOne()
		const status2 = await Status.createQueryBuilder('status')
			.where('status.id = :id2', { id2 })
			.getOne()

		if (!status1 || !status2)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Either status does not exist in the system',
			})

		if (status1.index > status2.index) {
			const allstatus = await Status.createQueryBuilder('status')
				.where('status.index >= :index and status.projectId = :projectId', {
					index: status2.index,
					projectId,
				})
				.getMany()

			if (allstatus)
				await Promise.all(
					allstatus.map(async (status) => {
						return new Promise(async (resolve) => {
							const result = Status.update(
								{
									id: Number(status.id),
								},
								{
									index: Number(status.index) + 1,
								}
							)
							resolve(result)
						})
					})
				)
		}

		if (status1.index < status2.index) {
			const allstatus = await Status.createQueryBuilder('status')
				.where(
					'status.index > :index and status.index <= :index2 and status.projectId = :projectId',
					{
						index: status1.index,
						index2: status2.index,
						projectId,
					}
				)
				.getMany()

			if (allstatus)
				await Promise.all(
					allstatus.map(async (status) => {
						return new Promise(async (resolve) => {
							status.index = status.index - 1
							resolve(await status.save())
						})
					})
				)
		}

		status1.index = status2.index
		await status1.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'change position of status success',
		})
	}),
}

export default statusController
