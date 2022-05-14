import { Request, Response } from 'express'
import { Client } from '../entities/Client'
import { Department } from '../entities/Department'
import { Employee } from '../entities/Employee'
import { Project } from '../entities/Project'
import { Project_Category } from '../entities/Project_Category'
import { Project_file } from '../entities/Project_File'
import { createOrUpdateProjectPayload } from '../type/ProjectPayload'
import handleCatchError from '../utils/catchAsyncError'
import { projectValid } from '../utils/valid/projectValid'

const projectController = {
    //Create new project
    create: handleCatchError(async (req: Request, res: Response) => {
        const dataNewProject: createOrUpdateProjectPayload = req.body
        const { project_category, department, client, employees, Added_by, project_files} = dataNewProject
        let projectEmployees: Employee[] = []

		//Check valid input create new project
		//Check valid
		const messageValid = projectValid.createOrUpdate(dataNewProject)
		
		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//check exist Added by
		if (Added_by) {
			const existingAddedBy = await Employee.findOne({
				where: {
					id: Added_by,
				},
			})
			if (!existingAddedBy)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Addmin add this project does not exist in the system',
				})
		}

		//check exist client
		const existingClient = await Client.findOne({
			where: {
				id: client,
			},
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
				id: department,
			},
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
				id: project_category,
			},
		})
		if (!existingCategories)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Category does not exist in the system',
			})

		for (let index = 0; index < employees.length; index++) {
			const employee_id = employees[index]
			const existingEmployee = await Employee.findOne({
				where: {
					id: employee_id,
				},
			})
			if (!existingEmployee)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Employees does not exist in the system',
				})
			projectEmployees.push(existingEmployee)
		}

		//create project file
        const createdProject = await Project.create({
            ...dataNewProject,
            employees: projectEmployees
        }).save()

		   //Create project files
		   for (let index = 0; index < project_files.length; index++) {
            const project_file = project_files[index];
            await Project_file.create({
                ...project_file,
				project: createdProject
            }).save()
        }

		return res.status(200).json({
			code: 200,
			success: true,
			project: createdProject,
			message: 'Create new Project successfully',
		})
	}),


	//Update Project
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateProject: createOrUpdateProjectPayload = req.body
		const { Added_by, client, department, project_category, employees } = dataUpdateProject
		let projectEmployees: Employee[] = []

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

		//Check valid input create new project
		//Check valid
		const messageValid = projectValid.createOrUpdate(dataUpdateProject)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//check exist Added by
		const existingAddedBy = await Employee.findOne({
			where: {
				id: Added_by,
			},
		})
		if (!existingAddedBy)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Addmin add this project does not exist in the system',
			})

		//check exist client
		const existingClient = await Client.findOne({
			where: {
				id: client,
			},
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
				id: department,
			},
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
				id: project_category,
			},
		})
		if (!existingCategories)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Category does not exist in the system',
			})

		for (let index = 0; index < employees.length; index++) {
			const employee_id = employees[index]
			const existingEmployee = await Employee.findOne({
				where: {
					id: employee_id,
				},
			})
			if (!existingEmployee)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Employees does not exist in the system',
				})
			projectEmployees.push(existingEmployee)
		}

		//update project
		;(existingproject.name = dataUpdateProject.name),
			(existingproject.project_category = existingCategories),
			(existingproject.department = existingDepartment),
			(existingproject.client = existingClient),
			(existingproject.Added_by = existingAddedBy),
			(existingproject.start_date = dataUpdateProject.start_date),
			(existingproject.deadline = dataUpdateProject.deadline),
			(existingproject.send_task_noti = true)
		existingproject.employees = projectEmployees

		await existingproject.save()

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
			},
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
				},
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
	}),
}

export default projectController
