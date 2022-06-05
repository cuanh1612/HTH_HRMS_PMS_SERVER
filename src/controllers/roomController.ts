import { Request, Response } from 'express'
import { Client } from '../entities/Client'
import { Employee } from '../entities/Employee'
import { Room } from '../entities/Room'
import { createOrUpdateRoomPayload } from '../type/RoomPayload'
import handleCatchError from '../utils/catchAsyncError'
import fetch from 'node-fetch'
import { Secret, verify } from 'jsonwebtoken'
import { UserAuthPayload } from '../type/UserAuthPayload'

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
			rooms: yourRooms,
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
				empl_create: true,
			},
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
			room: existRoom,
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
		await fetch(`${process.env.ZOOM_URL_API}/${existRoom.title}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.ZOOM_URL_KEY}`,
				Accept: 'application/json',
			},
		}).then((e) => e.json())

		await Room.delete({
			id: Number(id),
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete room successfully',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const {id} = req.params
		const {
			clients,
			employees,
			title,
			date,
			description,
			start_time,
		}: createOrUpdateRoomPayload = req.body

		//check exist current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		const existRoom = await Room.findOne({
			where: {
				id: Number(id)
			},
			relations: {
				empl_create: true
			}
		})

		if(!existRoom) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Room does not exist in system',
			})
				
		}

		if(existRoom.empl_create.id != decode.userId) {
			return res.status(400).json({
				code: 403,
				success: false,
				message: 'You are not allow to edit',
			})
		}

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

		await fetch(`${process.env.ZOOM_URL_API}/${existRoom.title}`, {
			method: 'POST',
			body: JSON.stringify({
				name: title.replace(/ /g, '-'),
			}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.ZOOM_URL_KEY}`,
				Accept: 'application/json',
			},
		}).then((e) => e.json())

		await Room.update({id: existRoom.id}, {
			title: title.replace(/ /g, '-'),
			date: new Date(new Date(date).toLocaleDateString()),
			description,
			start_time,
			clients: clientsInfo,
			employees: employeesInfo,
			link: `${process.env.URL_CLIENT}/rooms/${title.replace(/ /g, '-')}`,
		})

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update room successfully',
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
			title: title.replace(/ /g, '-'),
			date: new Date(new Date(date).toLocaleDateString()),
			description,
			start_time,
			clients: clientsInfo,
			employees: employeesInfo,
			empl_create: existEmployee,
			link: `${process.env.URL_CLIENT}/rooms/${title.replace(/ /g, '-')}`,
		}).save()

		await fetch(`${process.env.ZOOM_URL_API}`, {
			method: 'POST',
			body: JSON.stringify({
				name: title.replace(/ /g, '-'),
				properties: {
					lang: 'env',
					enable_screenshare: true,
					enable_chat: true,
					start_video_off: true,
					start_audio_off: false,
				},
			}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.ZOOM_URL_KEY}`,
				Accept: 'application/json',
			},
		}).then((e) => e.json())

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Create new room successfully',
		})
	}),
}

export default roomControler
