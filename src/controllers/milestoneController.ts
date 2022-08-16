import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Client } from '../entities/Client'
import { Employee, enumRole } from '../entities/Employee'
import { Milestone } from '../entities/Milestone'
import { Project } from '../entities/Project'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'
import { CreateProjectActivity } from '../utils/helper'

const mileStoneController = {
	create: handleCatchError(async (req: Request, res: Response) => {
		const { title, summary, project, cost } = req.body

		//Check exist project
		const existingProject = await Project.findOne({
			where: {
				id: project,
			},
			relations: {
				project_Admin: true,
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

		//Create project

		if (!title)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please enter title of milestone',
			})

		await Milestone.create({
			title: title,
			summary: summary,
			project: project,
			cost: Number(cost),
		}).save()

		//Crete activity for project
		await CreateProjectActivity(
			res,
			existingProject.id,
			'New milestone status Added To The Project'
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create milestone success',
		})
	}),
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const milestones = await Milestone.find({})
		return res.status(200).json({
			code: 200,
			success: true,
			milestones,
			message: 'Get milestones by project success',
		})
	}),
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateMileStone: Milestone = req.body

		const existingMileStone = await Milestone.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingMileStone)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Milestone does not existing in the system',
			})

		existingMileStone.title = dataUpdateMileStone.title
		existingMileStone.summary = dataUpdateMileStone.summary
		existingMileStone.cost = dataUpdateMileStone.cost
		existingMileStone.addtobudget = dataUpdateMileStone.addtobudget
		existingMileStone.status = dataUpdateMileStone.status

		await existingMileStone.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update milestone successfully',
		})
	}),

	getByProjectWithTask: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingProject = await Project.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not existing',
			})

		const existingMileStones = await Milestone.find({
			where: {
				project: {
					id: Number(id),
				},
			},
			relations: {
				tasks: true,
			},
		})

		if (!existingMileStones)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'MileStone does not existing in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			milestones: existingMileStones,
			message: 'Get milestones by project success',
		})
	}),

	getByProject: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingProject = await Project.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not existing',
			})

		const existingMileStones = await Milestone.find({
			where: {
				project: {
					id: Number(id),
				},
			},
		})

		if (!existingMileStones)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'MileStone does not existing in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			milestones: existingMileStones,
			message: 'Get milestones by project success',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingMileStone = await Milestone.findOne({
			where: {
				id: Number(id),
			},
			relations: {
				tasks: {
					employees: true,
					status: true,
					assignBy: true,
				},
			},
		})

		if (!existingMileStone)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'MileStone does not existing in the system',
			})
		return res.status(200).json({
			code: 200,
			success: true,
			milestone: existingMileStone,
			message: 'Get milestones by project success',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingMileStone = await Milestone.findOne({
			where: {
				id: Number(id),
			},
			relations: {
				project: true,
			},
			select: {
				id: true,
			},
		})

		if (!existingMileStone)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'MileStone does not existing in the system',
			})

		//Check exist project
		const existingProject = await Project.findOne({
			where: {
				id: existingMileStone.project.id,
			},
			relations: {
				project_Admin: true,
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

		//Delete milestone
		await existingMileStone.remove()
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete of milestone success',
		})
	}),
}

export default mileStoneController
