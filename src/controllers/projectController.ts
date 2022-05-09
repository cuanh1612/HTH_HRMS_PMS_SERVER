
import { Request, Response } from 'express'
import { Client } from '../entities/Client'
import { Department } from '../entities/Department'
import { Employee } from '../entities/Employee'
import { Holiday } from '../entities/Holiday'
import { Project } from '../entities/Project'
import { Project_Category } from '../entities/Project_Category'
import { createOrUpdateProjectPayload } from '../type/ProjectPayload'
import handleCatchError from '../utils/catchAsyncError'

const projectController = {
    //Create new project
    create: handleCatchError(async (req: Request, res: Response) => {
        const dataNewProject: createOrUpdateProjectPayload = req.body
        const { name, project_category, department, client, employees } = dataNewProject
        let projectEmployees : Employee[] = []

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
        //check exist client
        const existingClient = await Client.findOne({
            where: {
                id: client
            }
        })
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            })
        //check exist department
        const existingDepartment = await Department.findOne({
            where: {
                id: department
            }
        })
        if (!existingDepartment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            })
        //check exist project categories
        const existingCategories = await Project_Category.findOne({
            where: {
                id: project_category
            }
        })
        if (!existingCategories)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Category does not exist in the system',
            })

        for (let index = 0; index < employees.length; index++) {
            const employee_id = employees[index];
            const existingEmployee = await Employee.findOne({
                where: {
                    id: employee_id
                }
            })
            if (!existingEmployee)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Employees does not exist in the system'
                })
            projectEmployees.push(existingEmployee)

        }

        const createdProject = await Project.create({
            ...dataNewProject,
            employees: projectEmployees
        }).save()

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