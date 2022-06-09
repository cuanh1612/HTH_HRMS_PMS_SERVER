import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Client } from '../entities/Client'
import { Employee } from '../entities/Employee'
import { Notification } from '../entities/Notification'
import { createOrUpdatetNotificationPayload } from '../type/NotificationPayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'
import { notificationValid } from '../utils/valid/notificationValid'

const notificationController = {
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewNotification: createOrUpdatetNotificationPayload = req.body
		const { content, url } = dataNewNotification

		//check exist current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		const existingUser =
			decode.role === 'Client'
				? await Client.findOne({
						where: {
							id: decode.userId,
						},
				  })
				: await Employee.findOne({
						where: {
							id: decode.userId,
						},
				  })

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		//Check valid
		const messageValid = notificationValid.createOrUpdate(dataNewNotification)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Create new notification
		const createNotification = await Notification.create({
			url,
			content,
			...(existingUser.role === 'Client'
				? { client: existingUser }
				: { employee: existingUser }),
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			notification: createNotification,
			message: 'Created notification successfully',
		})
	}),

	getAllByCurrentUser: handleCatchError(async (req: Request, res: Response) => {
		//check exist current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		const existingUser =
			decode.role === 'Client'
				? await Client.findOne({
						where: {
							id: decode.userId,
						},
				  })
				: await Employee.findOne({
						where: {
							id: decode.userId,
						},
				  })

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		//Get all notifications
		const allNotifications = await Notification.find({
			where: {
				...(existingUser.role === 'Client'
					? { client: { id: existingUser.id } }
					: { employee: { id: existingUser.id } }),
			},
			order: {
				createdAt: "DESC"
			}
		})

		return res.status(200).json({
			code: 200,
			success: true,
			notifications: allNotifications,
			message: 'Get all notifications by current user successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { notificationId } = req.params

		//check exist current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		const existingUser =
			decode.role === 'Client'
				? await Client.findOne({
						where: {
							id: decode.userId,
						},
				  })
				: await Employee.findOne({
						where: {
							id: decode.userId,
						},
				  })

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		//Check existing notification
		const exisingNotification = await Notification.findOne({
			where: {
				id: Number(notificationId),
			},
			relations: {
				employee: true,
				client: true
			}
		})

		if (!exisingNotification)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Notification does not exist in the system',
			})

		//Check author
		if (
			!(
				existingUser.role === 'Client' && existingUser.id === exisingNotification.client.id
			) &&
			!(existingUser.id === exisingNotification.employee.id)
		)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You are not authorized to perform this action',
			})

		//Remove notification
		await exisingNotification.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Remove notification successfully',
		})
	}),
}

export default notificationController
