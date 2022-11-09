import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Employee } from '../entities/Employee.entity'
import { Project } from '../entities/Project.entity'
import { Project_discussion_reply } from '../entities/Project_Discussion_Reply.entity'
import { Project_Discussion_Room } from '../entities/Project_Discussion_Room.entity'
import { createOrUpdateProjectDiscussionReplyPayload } from '../type/ProjectDiscussionReplyPayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'

const projectDiscussionReplyController = {
	//create new discussion reply
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewDiscussionReply: createOrUpdateProjectDiscussionReplyPayload = req.body
		const { project, project_discussion_room } = dataNewDiscussionReply

		//check project discussion room
		const existingProjectDiscussionRoom = await Project_Discussion_Room.findOne({
			where: {
				id: project_discussion_room,
			},
		})

		if (!existingProjectDiscussionRoom)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project discussion room does not exist in the system',
			})

		//check project exists
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
		const existingUser = await Employee.findOne({
			where: {
				id: decode.userId,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		if (!existingProject.employees.some((employee) => employee.id === existingUser.id))
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Employee does not exist in the discussion room',
			})

		await Project_discussion_reply.create({
			reply: dataNewDiscussionReply.reply,
			employee: existingUser,
			project_discussion_room: existingProjectDiscussionRoom,
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Reply successfully',
		})
	}),

	getByProjectDiscussionRoom: handleCatchError(async (req: Request, res: Response) => {
		const { projectDiscussionRoomId } = req.params

		//check exist project discussion room
		const existingProjectDiscussionRoom = await Project_Discussion_Room.findOne({
			where: {
				id: Number(projectDiscussionRoomId),
			},
		})

		if (!existingProjectDiscussionRoom)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project discussion room does not exist in the system',
			})

		const replies = await Project_discussion_reply.find({
			where: {
				project_discussion_room: { id: existingProjectDiscussionRoom.id },
			},
			order: {
				createdAt: 'DESC',
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			projectDiscussionReplies: replies,
			message: 'Get replies by project discussion success',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { reply_id } = req.params

		//check existing reply
		const existingReply = await Project_discussion_reply.findOne({
			where: {
				id: Number(reply_id),
			},
		})
		if (!existingReply)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project discussion reply does not exist in the system',
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
		const existingUser = await Employee.findOne({
			where: {
				id: decode.userId,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		//check author reply
		if (existingUser.id === existingReply.employee.id) {
			await existingReply.remove()
		} else {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You not authorization action this request',
			})
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete discussion reply success',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const { reply_id } = req.params
		const { reply } = req.body
		//check existing reply
		const existingReply = await Project_discussion_reply.findOne({
			where: {
				id: Number(reply_id),
			},
		})
		if (!existingReply)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project discussion reply does not exist in the system',
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
		const existingUser = await Employee.findOne({
			where: {
				id: decode.userId,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		//check author reply
		if (existingUser.id === existingReply.employee.id) {
			existingReply.reply = reply
			await existingReply.save()
		} else {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You not authorization action this request',
			})
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update reply success',
		})
	}),

    getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { reply_id } = req.params
		//check existing reply
		const existingReply = await Project_discussion_reply.findOne({
			where: {
				id: Number(reply_id),
			},
		})
		if (!existingReply)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project discussion reply does not exist in the system',
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
		const existingUser = await Employee.findOne({
			where: {
				id: decode.userId,
			},
		})

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		//check author reply
		if (existingUser.id != existingReply.employee.id){
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You not authorization action this request',
			})
		}

		return res.status(200).json({
			code: 200,
			success: true,
            projectDiscussionReply: existingReply,
			message: 'Update reply success',
		})
	}),
}

export default projectDiscussionReplyController
