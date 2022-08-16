import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Client } from '../entities/Client'
import { Employee, enumRole } from '../entities/Employee'
import { Project } from '../entities/Project'
import { Status } from '../entities/Status'
import { createOrUpdateStatusPayload } from '../type/statusPayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'
import { CreateProjectActivity } from '../utils/helper'
import { statusValid } from '../utils/valid/statusValid'

const statusController = {
	//create new status
	create: handleCatchError(async (req: Request, res: Response) => {
		const { projectId, title, color } = req.body

		if (!projectId || !title || !color) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please enter full field',
			})
		}

		const lastStatus = await Status.findOne({
			where: {
				project: {
					id: projectId,
				},
			},
			order: {
				index: 'DESC',
			},
		})

		if (!lastStatus)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Status does not exist in the system',
			})

		const existingProject = await Project.findOne({
			where: {
				id: projectId,
			},
			relations: {
				project_Admin: true,
			},
			select: {
				project_Admin: {
					email: true,
				},
			},
		})
		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//check exist current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		//Get data user
		const existingUser =
			(await Employee.findOne({
				where: {
					email: decode.email,
				},
			})) ||
			(await Client.findOne({
				where: {
					email: decode.email,
				},
			}))

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		if (
			existingUser.role !== enumRole.ADMIN &&
			existingUser.email !== existingProject.project_Admin.email
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You do not have permission to perform this feature',
			})

		//Create status
		const result = await Status.create({
			project: existingProject,
			title: title,
			color: color,
			index: lastStatus.index + 1,
		}).save()

		//Crete activity for project
		await CreateProjectActivity(
			res,
			existingProject.id,
			'New column status Added To The Project'
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create status success',
			result,
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingStatus = await Status.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingStatus)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Status does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			status: existingStatus,
			message: 'Get detail of project success',
		})
	}),

	//get all status by project
	getAllPj: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params

		const findByProject = await Status.find({
			where: {
				project: {
					id: Number(projectId),
				},
			},
		})

		if (!findByProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			statuses: findByProject,
			message: 'Get all status success',
		})
	}),

	//get all status by project (with task)
	getAllWithTask: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params

		const findByProject = await Status.find({
			where: {
				project: {
					id: Number(projectId),
				},
			},
			relations: {
				tasks: {
					employees: true,
					assignBy: true,
				},
			},
			order: {
				index: 'ASC',
				tasks: {
					index: 'ASC',
				},
			},
		})

		if (!findByProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			statuses: findByProject,
			message: 'Get all status success',
		})
	}),

	//Update status
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateStatus: createOrUpdateStatusPayload = req.body

		const existingStatus = await Status.findOne({
			where: {
				id: Number(id),
			},
			relations: {
				project: {
					project_Admin: true
				}
			},
			select: {
				project: {
					id: true
				}
			}
		})

		if (!existingStatus)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'status does not existing in the system',
			})
		
		//Get existing project to check auth if current user have role project admin
		const existingProject = await Project.findOne({
			where: {
				id: existingStatus.project.id,
			},
			relations: {
				project_Admin: true,
			},
			select: {
				project_Admin: {
					email: true,
				},
			},
		})
		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//Check auth current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		//Get data user
		const existingUser =
			(await Employee.findOne({
				where: {
					email: decode.email,
				},
			})) ||
			(await Client.findOne({
				where: {
					email: decode.email,
				},
			}))

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		if (
			existingUser.role !== enumRole.ADMIN &&
			existingUser.email !== existingProject.project_Admin.email
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You do not have permission to perform this feature',
			})

		//Update status
		const messageValid = statusValid.createOrUpdate(existingStatus, 'update')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})
		;(existingStatus.title = dataUpdateStatus.title),
			(existingStatus.color = dataUpdateStatus.color)

		await existingStatus.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update Status success',
		})
	}),

	//Delete status
	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingStatus = await Status.findOne({
			where: {
				id: Number(id),
			},
			relations: {
				project: {
					project_Admin: true
				}
			},
			select: {
				project: {
					id: true
				}
			}
		})

		if (!existingStatus)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'status does not existing in the system',
			})
		
		//Get existing project to check auth if current user have role project admin
		const existingProject = await Project.findOne({
			where: {
				id: existingStatus.project.id,
			},
			relations: {
				project_Admin: true,
			},
			select: {
				project_Admin: {
					email: true,
				},
			},
		})
		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//Check auth current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		//Get data user
		const existingUser =
			(await Employee.findOne({
				where: {
					email: decode.email,
				},
			})) ||
			(await Client.findOne({
				where: {
					email: decode.email,
				},
			}))

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		if (
			existingUser.role !== enumRole.ADMIN &&
			existingUser.email !== existingProject.project_Admin.email
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You do not have permission to perform this feature',
			})

		//Delete status 

		const messageValid = statusValid.createOrUpdate(existingStatus, 'update')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		existingStatus.remove()
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete status success',
		})
	}),

	//Change position of status
	changePosition: handleCatchError(async (req: Request, res: Response) => {
		const { id1, id2, projectId } = req.body

		//Get existing project to check auth if current user have role project admin
		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
			relations: {
				project_Admin: true,
			},
			select: {
				project_Admin: {
					email: true,
				},
			},
		})
		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//Check auth current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		//Get data user
		const existingUser =
			(await Employee.findOne({
				where: {
					email: decode.email,
				},
			})) ||
			(await Client.findOne({
				where: {
					email: decode.email,
				},
			}))

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		if (
			existingUser.role !== enumRole.ADMIN &&
			existingUser.email !== existingProject.project_Admin.email
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You do not have permission to perform this feature',
			})

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
			const allStatus = await Status.createQueryBuilder('status')
				.where('status.index >= :index and status.projectId = :projectId', {
					index: status2.index,
					projectId,
				})
				.getMany()

			if (allStatus)
				await Promise.all(
					allStatus.map(async (status) => {
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
			const allStatus = await Status.createQueryBuilder('status')
				.where(
					'status.index > :index and status.index <= :index2 and status.projectId = :projectId',
					{
						index: status1.index,
						index2: status2.index,
						projectId,
					}
				)
				.getMany()

			if (allStatus)
				await Promise.all(
					allStatus.map(async (status) => {
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
