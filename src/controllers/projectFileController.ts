import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Client } from '../entities/Client'
import { Employee, enumRole } from '../entities/Employee'
import { Project } from '../entities/Project'
import { Project_file } from '../entities/Project_File'
import { createOrUpdateProjectFilesPayload } from '../type/projectFilePayLoad'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'

const projectFileController = {
	create: handleCatchError(async (req: Request, res: Response) => {
		const { files, project, assignBy } = req.body as createOrUpdateProjectFilesPayload

		//Check exist Project
		const existingProject = await Project.findOne({
			where: {
				id: project,
			},
		})

		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//Check exist assign by
		if (assignBy) {
			const existingAssignBy = await Employee.findOne({
				where: {
					id: assignBy,
				},
			})

			if (!existingAssignBy)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Employee assign not exist in the system',
				})
		}

		//Create new project file
		if (Array.isArray(files)) {
			files.map(async (file) => {
				await Project_file.create({
					...(assignBy ? { assignBy: assignBy } : {}),
					...file,
					project: existingProject,
				}).save()
			})
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create new Project files success successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { projectFileId, projectId } = req.params

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

		//Check exist Project file
		const existingProjectFile = await Project_file.findOne({
			where: {
				id: Number(projectFileId),
				project: {
					id: Number(projectId),
				},
			},
		})

		if (!existingProjectFile)
			return res.status(400).json({
				code: 400,
				success: false,
				message: `Project file does not exist in the system`,
			})

		//Delete project file
		await existingProjectFile.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete Project file success successfully',
		})
	}),

	getAll: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params

		//Check exist Project
		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
		})

		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//Get all project file
		const projectFiles = await Project_file.find({
			where: {
				project: {
					id: Number(projectId),
				},
			},
			order: {
				createdAt: 'DESC',
			},
			relations: {
				assignBy: true,
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			projectFiles,
			message: 'Get all project files success successfully',
		})
	}),
}

export default projectFileController
