import { Request, Response } from 'express'
import { Project } from '../entities/Project'
import { Project_file } from '../entities/Project_File'
import { createOrUpdatetProjectFilesPayload } from '../type/projectFilePayLoad'
import handleCatchError from '../utils/catchAsyncError'

const projectFileController = {
	create: handleCatchError(async (req: Request, res: Response) => {
		const { files, project } = req.body as createOrUpdatetProjectFilesPayload

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
				message: 'Contract does not exist in the system',
			})

		//Create new project file
		if (Array.isArray(files)) {
			files.map(async (file) => {
				await Project_file.create({
					...file,
                    project: existingProject
				}).save()
			})
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create new contract files success successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { projectFileId, projectId } = req.params

		//auth Header here is "Bearer accessToken"
		const authHeader = req.header('Authorization')
		const accessToken = authHeader && authHeader.split(' ')[1]

		if (!accessToken)
			return res.status(401).json({
				code: 401,
				success: false,
				message: 'Not authenticated to perform operations',
			})

		//Check exist project
		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
		})

		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract does not exist in the system',
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
				message: `Contract file does not exist in the system ${projectFileId} ${projectId}`,
			})

		//Delete project file
		await existingProjectFile.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete contract file success successfully',
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
				message: 'Contract does not exist in the system',
			})

        //Get all project file 
        const projectFiles = await Project_file.find({
            where: {
                project: {
                    id: Number(projectId)
                }
            },
            order: {
                createdAt: "DESC"
            }
        })

        return res.status(200).json({
			code: 200,
			success: true,
            projectFiles,
			message: 'Get all contract files success successfully',
		})
	}),
}

export default projectFileController
