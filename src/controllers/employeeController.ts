import argon2 from 'argon2'
import { Request, Response } from 'express'
import { Avatar } from '../entities/Avatar'
import { Department } from '../entities/Department'
import { Designation } from '../entities/Designation'
import { Employee } from '../entities/Employee'
import { createOrUpdatetEmployeePayload } from '../type/EmployeePayload'
import handleCatchError from '../utils/catchAsyncError'
import { employeeValid } from '../utils/valid/employeeValid'

const employeeController = {
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const employees = await Employee.find()
		return res.status(200).json({
			code: 200,
			success: true,
			employees: employees,
			message: 'Get all employees successfully',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { employeeId } = req.params

		//Check existing employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: Number(employeeId),
			},
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			employee: existingEmployee,
			message: 'Get detail employee successfully',
		})
	}),

	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewEmployee: createOrUpdatetEmployeePayload = req.body
		console.log(dataNewEmployee)

		//Check valid
		const messageValid = employeeValid.createOrUpdate(dataNewEmployee, 'create')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing email
		const existingEmployee = await Employee.findOne({
			where: {
				email: dataNewEmployee.email,
			},
		})

		if (existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Email already exists in the system',
			})

		//Check existing department
		if (dataNewEmployee.department) {
			const existingDepartment = await Department.findOne({
				where: {
					id: dataNewEmployee.department,
				},
			})

			if (!existingDepartment)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Department does not exist in the system',
				})
		}

		//Check existing designation
		if (dataNewEmployee.designation) {
			const existingDesignation = await Designation.findOne({
				where: {
					id: dataNewEmployee.designation,
				},
			})

			if (!existingDesignation)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Designation does not exist in the system',
				})
		}

		const hashPassword = await argon2.hash(dataNewEmployee.password)

		//Create new employee
		const newEmployee = Employee.create({
			...dataNewEmployee,
			password: hashPassword,
		})

		const createdEmployee = await newEmployee.save()

		return res.status(200).json({
			code: 200,
			success: true,
			employee: createdEmployee,
			message: 'Created new Employee successfully',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const dataUpdateEmployee: createOrUpdatetEmployeePayload = req.body
		const { employeeId } = req.params

		//Check valid
		const messageValid = employeeValid.createOrUpdate(dataUpdateEmployee, 'update')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: Number(employeeId),
			},
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		//Check existing department
		if (dataUpdateEmployee.department) {
			const existingDepartment = await Department.findOne({
				where: {
					id: dataUpdateEmployee.department,
				},
			})

			if (!existingDepartment)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Department does not exist in the system',
				})
		}

		//Check existing designation
		if (dataUpdateEmployee.designation) {
			const existingDesignation = await Designation.findOne({
				where: {
					id: dataUpdateEmployee.designation,
				},
			})

			if (!existingDesignation)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Designation does not exist in the system',
				})
		}

		//Check exist and update avatar
		const { avatar, ...dataUpdateEmployeeBase } = dataUpdateEmployee
		let newAvatar: Avatar | null = null

		if (avatar) {
			if (existingEmployee.avatar) {
				const existingAvatar = await Avatar.findOne({
					where: {
						id: existingEmployee.avatar.id,
					},
				})

				if (existingAvatar) {
					await Avatar.update(existingAvatar.id, {
						...avatar,
					})
				}
			} else {
				newAvatar = await Avatar.create({
					...avatar,
				}).save()
			}
		}

		//Update employee
		await Employee.update(
			{
				id: existingEmployee.id,
			},
			{
				...dataUpdateEmployeeBase,
				...(dataUpdateEmployeeBase.password
					? { password: await argon2.hash(dataUpdateEmployee.password) }
					: {}),
				...(newAvatar
					? {
							avatar: newAvatar,
					  }
					: {}),
			}
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated employee successfully',
		})
	}),

	changeRole: handleCatchError(async (req: Request, res: Response) => {
		const { employeeId, role } = req.body

		//Check valid
		const messageValid = employeeValid.changeRole(employeeId, role)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: employeeId,
			},
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		//Update role employee
		existingEmployee.role = role
		await existingEmployee.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated role employee successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { employeeId } = req.params

		//Check existing employee
		const existingEmployee = await Employee.findOne({
			where: {
				id: Number(employeeId),
			},
		})

		if (!existingEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the system',
			})

		//Delete employee
		await existingEmployee.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete employee successfully',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { employees } = req.body
		if (employees)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please select many employees to delete',
			})

		for (let index = 0; index < employees.length; index++) {
			const employeeId = employees[index]

			//Check existing employee
			const existingEmployee = await Employee.findOne({
				where: {
					id: Number(employeeId),
				},
			})

			if (!existingEmployee)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Employee does not exist in the system',
				})

			//Delete employee
			await existingEmployee.remove()
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete employee successfully',
		})
	}),
}

export default employeeController
