import { Request, Response } from 'express'
import { Client } from '../entities/Client'
import { Employee } from '../entities/Employee'
import { Room } from '../entities/Room'
import { createOrUpdateRoomPayload } from '../type/RoomPayload'
import handleCatchError from '../utils/catchAsyncError'

const roomControler = {
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

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const existRoom = await Room.findOne({
			where: {
				id: Number(id),
			},
			relations: {
				clients: true,
				employees: true,
				empl_create: true
			}
		})

		if (!existRoom) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Room does not exist in system',
			})
		}
		
		return res.status(200).json({
			code: 200,
			success: true,
			your_room: existRoom,
			message: 'Create new Project files successfully',
		})


		
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const existRoom = await Room.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existRoom) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Room does not exist in system',
			})
		}

		await Room.delete({
			id: Number(id)
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete room successfully',
		})
	}),

	create: handleCatchError(async (req: Request, res: Response) => {
		const {
			empl_create,
			clients,
			employees,
			title,
			date,
			description,
			start_time,
		}: createOrUpdateRoomPayload = req.body
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

		const clientsInfo: Client[] = [] 
		await Promise.all(
			clients.map(async (id: number) => {
				return new Promise(async (resolve) => {
					const data = await Client.findOne({
						where: {
							id,
						},
					})
					if (data) {
						clientsInfo.push(data)
					}
					resolve(true)
				})
			})
		)

		const employeesInfo: Employee[] = []
		await Promise.all(
			employees.map(async (id: number) => {
				return new Promise(async (resolve) => {
					const data = await Employee.findOne({
						where: {
							id,
						},
					})
					if (data) {
						employeesInfo.push(data)
					}
					resolve(true)
				})
			})
		)

		await Room.create({
			title,
			date: new Date(new Date(date).toLocaleDateString()),
			description,
			start_time,
			clients: clientsInfo,
			employees: employeesInfo,
			empl_create: existEmployee,
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create new room successfully',
		})
	}),
}

export default roomControler
