import { Request, Response } from 'express'
import { Client } from '../entities/Client'
import { Employee } from '../entities/Employee'
import { Room } from '../entities/Room'
import handleCatchError from '../utils/catchAsyncError'

const salaryController = {
	getAll: handleCatchError(async (req: Request, res: Response) => {
		const { employee, client }: any = req.query
		const existEmployee = await Employee.findOne({
			where: {
				id: employee,
			},
		})

		const existClient = await Client.findOne({
			where: {
				id: client,
			},
		})

		if (!existEmployee && !existClient)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Person does not exist in system',
			})

		const yourRooms = await Room.find({
			where: {
				empl_create: {
					id: existEmployee?.id || existClient?.id,
				},
			},
			relations: {
				empl_create: true,
				employees: true,
				clients: true,
			},
		})

		const filter = existEmployee
			? {
					employees: {
						id: existEmployee.id,
					},
			  }
			: existClient
			? {
					clients: {
						id: existClient.id,
					},
			  }
			: undefined
		const anotherRooms = await Room.find({
			where: filter,
			relations: {
				empl_create: true,
				employees: true,
				clients: true,
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			your_rooms: yourRooms,
			another_rooms: anotherRooms,
			message: 'Create new Project files successfully',
		})
	}),

	create: handleCatchError(async (req: Request, res: Response) => {
		const {
			empl_create,
			clients,
			employees,
		}: { empl_create: number; clients: number[]; employees: number[] } = req.body
		const existEmployee = await Employee.findOne({
			where: {
				id: empl_create,
			},
		})

		if (!existEmployee)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create new Project files successfully',
		})
	}),
}

export default salaryController
