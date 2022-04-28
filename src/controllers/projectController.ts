
import { Request, Response } from 'express'
import { Holiday } from '../entities/Holiday'
import { Project } from '../entities/Project'
import handleCatchError from '../utils/catchAsyncError'

const projectController = {
    //Create new project
    create: handleCatchError(async (req: Request, res: Response) => {
        const dataNewProject: Project = req.body
        const { name } = dataNewProject

        //check existing name of project
        const existingName = await Project.findOne({
            where: {
                name: String(name)
            }
        })

        if (existingName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Name of project already exist in the system',
            })

        const createdProject = await Project.create(dataNewProject).save()

        return res.status(200).json({
            code: 200,
            success: true,
            project: createdProject,
            message: 'Create new Project successfully'
        })
    }),

    //Update Project
    update: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params
        const dataUpdateProject: Project = req.body

        const existingproject = await Holiday.findOne({
            where: {
                id: Number(id),
            }
        })

        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system'
            })
        await Project.update(existingproject.id, {
            ...dataUpdateProject
        })

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update Project successfully',
        })
    }),

    //Get all project
    getAll: handleCatchError(async (_: Request, res: Response) => {
        const projects = await Project.find()
        return res.status(200).json({
            code: 200,
            success: true,
            projects: projects,
            message: 'Get all projects success',
        })
    }),

    //Get detail project
    getDetail: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingproject = await Project.findOne({
            where: {
                id: Number(id),
            },
        })

        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            })

        return res.status(200).json({
            code: 200,
            success: true,
            project: existingproject,
            message: 'Get detail of project success',
        })
    }),

    //Delete project
    delete: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingproject = await Project.findOne({
            where: {
                id: Number(id),
            }
        })

        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            })

        await existingproject.remove()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete project success',
        })
    }),

    deletemany: handleCatchError(async (req: Request, res: Response) => {
        const { projects } = req.body

        //check array of projects
        if (!Array.isArray(projects) || !projects)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            })
        for (let index = 0; index < projects.length; index++) {
            const itemProject = projects[index]
            const existingproject = await Project.findOne({
                where: {
                    id: itemProject.id,
                }
            })
            if (existingproject) {
                await existingproject.remove()
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete projects success',
        })
    })

}

export default projectController