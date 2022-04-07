import argon2 from 'argon2'
import { Request, Response } from 'express'
import { Avatar } from '../entities/Avatar'
import { Client } from '../entities/Client'
import { Client_Category } from '../entities/Client_Category'
import { Client_Sub_Category } from '../entities/Client_Sub_Category'
import { Employee } from '../entities/Employee'
import { createOrUpdatetClientPayload } from '../type/ClientPayload'
import handleCatchError from '../utils/catchAsyncError'
import { clientValid } from '../utils/valid/clientValid'

const clientController = {
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const clients = await Client.find()
		return res.status(200).json({
			code: 200,
			success: true,
			clients: clients,
			message: 'Get all clients successfully',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { clientId } = req.params

		//Check existing client
		const existingClient = await Client.findOne({
			where: {
				id: Number(clientId),
			},
		})

		if (!existingClient)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			client: existingClient,
			message: 'Get detail client successfully',
		})
	}),

	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewClient: createOrUpdatetClientPayload = req.body

		//Check valid
		const messageValid = clientValid.createOrUpdate(dataNewClient, 'create')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing email
		const existingEmployee = await Employee.findOne({
			where: {
				email: dataNewClient.email,
			},
		})

		const existingClient = await Client.findOne({
			where: {
				email: dataNewClient.email,
			},
		})

		if (existingEmployee || existingClient)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Email already exists in the system',
			})

		//Check existing client category
		if (dataNewClient.client_category) {
			const existCategory = await Client_Category.findOne({
				where: {
					id: dataNewClient.client_category,
				},
			})

			if (!existCategory)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Client category does not exist',
				})
		}

		//Check existing client sub category
		if (dataNewClient.client_sub_category) {
			const existSubCategory = await Client_Sub_Category.findOne({
				where: {
					id: dataNewClient.client_sub_category,
				},
			})

			if (!existSubCategory)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Client sub category does not exist',
				})

			//Check parent cateory of sub category is match with input category
			if (existSubCategory.client_category.id !== Number(dataNewClient.client_category))
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Client category does not match with the parent of sub-category',
				})
		}

		const hashPassword = await argon2.hash(dataNewClient.password)

		//Create new client
		const newClient = Client.create({
			...dataNewClient,
			password: hashPassword,
			client_category: dataNewClient.client_category
				? dataNewClient.client_category
				: undefined,
			client_sub_category: dataNewClient.client_sub_category
				? dataNewClient.client_sub_category
				: undefined,
			salutation: dataNewClient.salutation ? dataNewClient.salutation : undefined,
		})

		const createdClient = await newClient.save()

		return res.status(200).json({
			code: 200,
			success: true,
			client: createdClient,
			message: 'Created new client successfully',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const dataUpdateClient: createOrUpdatetClientPayload = req.body
		const { clientId } = req.params
		console.log(clientId)

		//Check valid
		const messageValid = clientValid.createOrUpdate(dataUpdateClient, 'update')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing client
		const existingClient = await Client.findOne({
			where: {
				id: Number(clientId),
			},
		})

		if (!existingClient)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client does not exist in the system',
			})

		//Check existing email
		if (dataUpdateClient.email !== existingClient.email) {
			const existingClientMail = await Client.findOne({
				where: {
					email: dataUpdateClient.email,
				},
			})

			const existingEmployeeMail = await Employee.findOne({
				where: {
					email: dataUpdateClient.email,
				},
			})

			if (existingClientMail || existingEmployeeMail)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Email already exists in the system',
				})
		}

		//Check existing client category
		if (dataUpdateClient.client_category) {
			const existCategory = await Client_Category.findOne({
				where: {
					id: dataUpdateClient.client_category,
				},
			})

			if (!existCategory)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Client category does not exist',
				})
		}

		//Check existing client sub category
		if (dataUpdateClient.client_sub_category) {
			const existSubCategory = await Client_Sub_Category.findOne({
				where: {
					id: dataUpdateClient.client_sub_category,
				},
			})

			if (!existSubCategory)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Client sub category does not exist',
				})

			//Check parent cateory of sub category is match with input category
			if (existSubCategory.client_category.id !== Number(dataUpdateClient.client_category))
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Client category does not match with the parent of sub-category',
				})
		}

		//Check exist and update avatar
		const { avatar, ...dataUpdateClientBase } = dataUpdateClient
		let newAvatar: Avatar | null = null

		if (avatar) {
			if (existingClient.avatar) {
				const existingAvatar = await Avatar.findOne({
					where: {
						id: existingClient.avatar.id,
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

		console.log(dataUpdateClientBase, existingClient)

		//Update client
		await Client.update(
			{
				id: existingClient.id,
			},
			{
				...dataUpdateClientBase,
				...(dataUpdateClientBase.password
					? { password: await argon2.hash(dataUpdateClient.password) }
					: {}),
				...(newAvatar
					? {
							avatar: newAvatar,
					  }
					: {}),
				client_category: dataUpdateClient.client_category
					? dataUpdateClient.client_category
					: undefined,
				client_sub_category: dataUpdateClient.client_sub_category
					? dataUpdateClient.client_sub_category
					: undefined,
				salutation: dataUpdateClient.salutation ? dataUpdateClient.salutation : undefined,
			}
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated client successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { clientId } = req.params

		//Check existing client
		const existingClient = await Client.findOne({
			where: {
				id: Number(clientId),
			},
		})

		if (!existingClient)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client does not exist in the system',
			})

		//Delete client
		await existingClient.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete client successfully',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { clients } = req.body
		if (!clients)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please select many clients to delete',
			})

		for (let index = 0; index < clients.length; index++) {
			const clientId = clients[index]

			//Check existing client
			const existingClient = await Client.findOne({
				where: {
					id: Number(clientId),
				},
			})

			if (existingClient) {
				//Delete client
				await existingClient.remove()
			}
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete clients successfully',
		})
	}),
}

export default clientController
