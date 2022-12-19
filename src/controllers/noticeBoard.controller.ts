import { Request, Response } from 'express'
import { Client } from '../entities/Client.entity'
import { Employee } from '../entities/Employee.entity'
import { enumNoticeTo, Notice_board } from '../entities/Notice_Board.entity'
import { Notification } from '../entities/Notification.entity'
import handleCatchError from '../utils/catchAsyncError'
import { noticeBoardValid } from '../utils/valid/noticeBoardValid'

const noticeBoardController = {
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewNoticeBoard: Notice_board = req.body
		const { notice_to, heading, details } = dataNewNoticeBoard

		//Check valid
		const messageValid = noticeBoardValid.createOrUpdate(dataNewNoticeBoard)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Create new notice board
		const createNoticeBoard = await Notice_board.create({
			notice_to,
			heading,
			details,
		}).save()

		//Create notification for employees or clients
		if (notice_to === enumNoticeTo.CLIENTS) {
			//Get all clients
			const clients = await Client.find({})

			await Promise.all(
				clients.map(async (client) => {
					return new Promise(async (resolve) => {
						//Create note for client
						await Notification.create({
							content: 'There is a notice board just posted',
							client: client,
							url: '/notice-boards',
						}).save()

						resolve(true)
					})
				})
			)
		} else if (notice_to === enumNoticeTo.EMPLOYEES) {
			//Get all employees
			const employees = await Employee.find({})

			await Promise.all(
				employees.map(async (employee) => {
					return new Promise(async (resolve) => {
						//Create note for client
						await Notification.create({
							content: 'There is a notice board just posted',
							employee: employee,
							url: '/notice-boards',
						}).save()

						resolve(true)
					})
				})
			)
		}

		return res.status(200).json({
			code: 200,
			success: true,
			noticeBoard: createNoticeBoard,
			message: 'Created notice successfully',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const { noticeBoardId } = req.params
		const dataUpdateNoticeBoard: Notice_board = req.body

		//Check valid
		const messageValid = noticeBoardValid.createOrUpdate(dataUpdateNoticeBoard)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing notice board
		const existingNotice = await Notice_board.findOne({
			where: {
				id: Number(noticeBoardId),
			},
		})

		if (!existingNotice)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Notice board not already exist in the system',
			})

		//Update notice board
		existingNotice.details = dataUpdateNoticeBoard.details
		existingNotice.heading = dataUpdateNoticeBoard.heading
		existingNotice.notice_to = dataUpdateNoticeBoard.notice_to
		await existingNotice.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated notice board successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { noticeBoardId } = req.params

		//Check existing notice board
		const existingNotice = await Notice_board.findOne({
			where: {
				id: Number(noticeBoardId),
			},
		})

		if (!existingNotice)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Notice board not already exist in the system',
			})

		//Delete notice
		await existingNotice.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Deleted notice board successfully',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { noticeBoards } = req.body

		if (!noticeBoards || !Array.isArray(noticeBoards))
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please send valid input delete many',
			})

		for (let index = 0; index < noticeBoards.length; index++) {
			const noticeBoardId = noticeBoards[index]

			//Check existing notice board
			const existingNotice = await Notice_board.findOne({
				where: {
					id: Number(noticeBoardId),
				},
			})

			if (!existingNotice)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Notice board not already exist in the system',
				})

			//Delete notice
			await existingNotice.remove()
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Deleted many notice boards successfully',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { noticeBoardId } = req.params

		//Check existing notice board
		const existingNotice = await Notice_board.findOne({
			where: {
				id: Number(noticeBoardId),
			},
		})

		if (!existingNotice)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Notice board not already exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			noticeBoard: existingNotice,
			message: 'Get detail notice board successfully',
		})
	}),

	getAll: handleCatchError(async (req: Request, res: Response) => {
		const { select } = req.query
		let noticeBoards: Notice_board[] = []

		switch (select) {
			case 'employees':
				noticeBoards = await Notice_board.find({
					where: {
						notice_to: 'Employees',
					},
				})
				break

			case 'clients':
				noticeBoards = await Notice_board.find({
					where: {
						notice_to: 'Clients',
					},
				})
				break

			default:
				noticeBoards = await Notice_board.find()
				break
		}

		return res.status(200).json({
			code: 200,
			success: true,
			noticeBoards,
			message: 'Get detail notice board successfully',
		})
	}),

	getAllByNoticeTo: handleCatchError(async (req: Request, res: Response) => {
		const { noticeTo } = req.params

		//get all notice
		const noticeBoards = await Notice_board.find({
			where: {
				notice_to: noticeTo,
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			noticeBoards: noticeBoards,
			message: 'Get notice boards by notice to successfully',
		})
	}),
}

export default noticeBoardController
