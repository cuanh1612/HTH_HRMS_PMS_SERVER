import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Client } from '../entities/Client'
import { Employee, enumRole } from '../entities/Employee'
import { Project } from '../entities/Project'
import { enumNoteType, Project_note } from '../entities/Project_Note'
import { createOrUpdateProjectNotePayload } from '../type/projectNotePayLoad'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'
import { projectNoteValid } from '../utils/valid/projectNoteValid'

const projectNoteController = {
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewProjectNote = req.body as createOrUpdateProjectNotePayload
		const { project, note_type, employees } = dataNewProjectNote
		let listEmployeesAdd: Employee[] = []

		//Check valid input
		const messageValid = projectNoteValid.createOrUpdate(dataNewProjectNote)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check exist project
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

		//Check type note private
		if (note_type === enumNoteType.PRIVATE) {
			if (Array.isArray(employees)) {
				await Promise.all(
					employees.map(async (employee: number) => {
						return new Promise(async (resolve) => {
							const existingEmployee = await Employee.findOne({
								where: {
									id: employee,
								},
							})

							if (existingEmployee) {
								listEmployeesAdd.push(existingEmployee)
							}

							resolve(existingEmployee)
						})
					})
				)
			}
		}

		//Create new project note
		await Project_note.create({
			...dataNewProjectNote,
			employees: listEmployeesAdd,
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create new Project files success successfully',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const { projectNoteId } = req.params
		const dataUpProjectNote = req.body as createOrUpdateProjectNotePayload
		const { project, note_type, employees } = dataUpProjectNote
		const listEmployeesUpdate: Employee[] = []

		//Check valid input
		const messageValid = projectNoteValid.createOrUpdate(dataUpProjectNote)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check exist project note
		const existProjectNote = await Project_note.findOne({
			where: {
				id: Number(projectNoteId),
				project: {
					id: project,
				},
			},
		})

		if (!existProjectNote)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project note does not exist in the system',
			})

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

		//Check type note private
		if (note_type === enumNoteType.PRIVATE) {
			if (Array.isArray(employees)) {
				await Promise.all(
					employees.map(async (employee: number) => {
						return new Promise(async (resolve) => {
							const existingEmployee = await Employee.findOne({
								where: {
									id: employee,
								},
							})

							if (existingEmployee) {
								listEmployeesUpdate.push(existingEmployee)
							}

							resolve(existingEmployee)
						})
					})
				)
			}
		}

		//Update project note
		existProjectNote.title = dataUpProjectNote.title
		existProjectNote.detail = dataUpProjectNote.detail
		existProjectNote.note_type = dataUpProjectNote.note_type
		existProjectNote.visible_to_client =
			dataUpProjectNote.note_type === 'Public' ? false : dataUpProjectNote.visible_to_client
		existProjectNote.ask_re_password =
			dataUpProjectNote.note_type === 'Public' ? false : dataUpProjectNote.ask_re_password
		existProjectNote.employees = listEmployeesUpdate
		await existProjectNote.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create new Project files success successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { projectNoteId } = req.params

		//Check exist project note
		const existingProjectNote = await Project_note.findOne({
			where: {
				id: Number(projectNoteId),
			},
			relations: {
				project: {
					project_Admin: true,
				},
			},
		})

		if (!existingProjectNote)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project note does not exist in the system',
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
			existingUser.email !== existingProjectNote.project.project_Admin.email
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You do not have permission to perform this feature',
			})

		await existingProjectNote.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete project note success successfully',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { projectNotes } = req.body as { projectNotes: number[] }

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

		await Promise.all(
			projectNotes.map(async (projectNoteId) => {
				new Promise(async (resolve) => {
					//Delete exist project note
					const existingProjectNote = await Project_note.findOne({
						where: {
							id: Number(projectNoteId),
						},
						relations: {
							project: {
								project_Admin: true,
							},
						},
					})

					if (existingProjectNote) {
						if (
							existingUser.role !== enumRole.ADMIN &&
							existingUser.email !== existingProjectNote.project.project_Admin.email
						)
							return res.status(400).json({
								code: 400,
								success: false,
								message: 'You do not have permission to perform this feature',
							})

						await existingProjectNote.remove()
					}

					return resolve(true)
				})
			})
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete many projects note success successfully',
		})
	}),

	getByProject: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params

		//Check exist project note
		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
			relations: {
				client: true,
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

		//Get all project note public
		const projectNotesPublic = await Project_note.find({
			where: {
				note_type: enumNoteType.PUBLIC,
				project: {
					id: Number(projectId),
				},
			},
			select: {
				project: {
					id: true,
				},
			},
			relations: {
				project: true,
			},
		})

		//Check if user is client will get private note for client
		if (existingUser.role === 'Client' && existingProject.client.id === existingUser.id) {
			//Get project note to client
			const projectNotesClient = await Project_note.find({
				where: {
					visible_to_client: true,
					project: {
						id: Number(projectId),
					},
				},
				select: {
					project: {
						id: true,
					},
				},
				relations: {
					project: true,
				},
			})

			return res.status(200).json({
				code: 200,
				success: true,
				projectNotes: [...projectNotesPublic, ...projectNotesClient],
				message: 'Get project note by project success successfully',
			})
		}

		if (
			existingUser.role === enumRole.ADMIN ||
			(existingUser.role === enumRole.EMPLOYEE &&
				existingUser.email === existingProject.project_Admin.email)
		) {
			const projectNotes = await Project_note.find({
				where: {
					project: {
						id: Number(projectId),
					},
				},
				select: {
					project: {
						id: true,
					},
				},
				relations: {
					project: true,
				},
			})

			return res.status(200).json({
				code: 200,
				success: true,
				projectNotes,
				message: 'Get project note by project success successfully',
			})
		}

		if (existingProject.employees.some((employeeItem) => employeeItem.id === existingUser.id)) {
			const projectNotesForClient = await Project_note.find({
				where: {
					project: {
						id: Number(projectId),
					},
					employees: [
						{
							id: existingUser.id,
						},
					],
				},
				select: {
					project: {
						id: true,
					},
				},
				relations: {
					project: true,
				},
			})

			return res.status(200).json({
				code: 200,
				success: true,
				projectNotes: [...projectNotesForClient, ...projectNotesPublic],
				message: 'Get project note by project success successfully',
			})
		}

		return res.status(200).json({
			code: 200,
			success: true,
			projectNotes: [],
			message: 'Get project note by project success successfully',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { projectNoteId } = req.params

		//Check exist project note
		const existingProjectNote = await Project_note.findOne({
			where: {
				id: Number(projectNoteId),
			},
			relations: {
				project: {
					project_Admin: true,
				},
			},
			select: {
				project: {
					id: true,
					project_Admin: {
						id: true,
					},
				},
			},
		})

		if (!existingProjectNote)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project note does not exist in the system',
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

		//Check if user is client will get private note for client
		if (
			(existingUser.role === 'Client' &&
				existingProjectNote.project.client.id === existingUser.id) ||
			existingUser.role === enumRole.ADMIN ||
			existingProjectNote.employees.some(
				(employeeItem) => employeeItem.id === existingUser.id
			) ||
			(existingProjectNote.project.project_Admin &&
				existingProjectNote.project.project_Admin.id === existingUser.id)
		) {
			return res.status(200).json({
				code: 200,
				success: true,
				projectNote: existingProjectNote,
				message: 'Get detail project note success successfully',
			})
		} else {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You do not have permission to perform this feature1',
			})
		}
	}),
}

export default projectNoteController
