import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Employee } from '../entities/Employee.entity'
import { Project } from '../entities/Project.entity'
import { Project_discussion_category } from '../entities/Project_Discussion_Category.entity'
import { Project_discussion_reply } from '../entities/Project_Discussion_Reply.entity'
import { Project_Discussion_Room } from '../entities/Project_Discussion_Room.entity'
import { createOrUpdateProjectDiscussionRoomPayload } from '../type/createOrUpdateProjectDiscussionRoomPayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'
import { projectDiscussionRoomValid } from '../utils/valid/projectDiscussionRoomValid'


const projectDiscussionRoomController = {
    create: handleCatchError(async (req: Request, res: Response) => {
        const dataNewPDiscussionRoom: createOrUpdateProjectDiscussionRoomPayload = req.body
        const { project, project_discussion_category, description } = dataNewPDiscussionRoom
        const messageValid = projectDiscussionRoomValid.createOrUpdate(dataNewPDiscussionRoom)

        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            })

        //check exists project
        const existingProject = await Project.findOne({
            where: {
                id: project
            }
        })
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system'
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
                message: 'User does not exist in the system'
            })


        if (!existingProject.employees.some((employeeItem) => employeeItem.id === existingUser.id) && decode.role !== "Admin")
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You not have authorization'
            })

        if (project_discussion_category) {
            //check exist project discussion category
            const existingPDCategory = await Project_discussion_category.findOne({
                where: {
                    id: project_discussion_category
                }
            })
            if (!existingPDCategory)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Project Discussion Category does not exist in the system'
                })
        }

        const createRoom = await Project_Discussion_Room.create({
            ...dataNewPDiscussionRoom,
            assigner: existingUser
        }).save()


        //create first reply
        await Project_discussion_reply.create({
            reply: description,
            project_discussion_room: createRoom,
            employee: existingUser
        }).save()

        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionRoom: createRoom,
            message: 'Create new project discussion room success',
        })
    }),

    Delete: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params
        const existingDiscussionRoom = await Project_Discussion_Room.findOne({
            where: {
                id: Number(id)
            },
            select: {
                project: {
                    id: true
                }
            },
            relations: {
                project: true
            }
        })
        

        if (!existingDiscussionRoom)
            return res.status(400).json({
                code: 400,
                success: false,
                message: ' Project discussion room does not exist in the system'
            })
        

        //get project
        const existingProject = await Project.findOne({
            where: {
                id: existingDiscussionRoom.project.id
            }
        })

        if(!existingProject){
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system'
            })
        }
        
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
                message: 'User does not exist in the system'
            })


        if (!existingProject.employees.some((employeeItem) => employeeItem.id === existingUser.id))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You not have authorization'
            })


        await existingDiscussionRoom.remove()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'delete project discussion room success'
        })
    }),

    getDetail: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params
        const existingDiscussionRoom = await Project_Discussion_Room.findOne({
            where: {
                id: Number(id)
            }

        })
        if (!existingDiscussionRoom)
            return res.status(400).json({
                code: 400,
                success: false,
                message: ' Project discussion room does not exist in the system'
            })

        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionRoom: existingDiscussionRoom,
            Message: 'Get detail project discussion room success'
        })
    }),

    getByProject: handleCatchError(async (req: Request, res: Response) => {
        const { project_id } = req.params
        const existingProject = await Project.findOne({
            where: {
                id: Number(project_id)
            }
        })
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system'
            })

        const projectDiscussionRooms = await Project_Discussion_Room.find({
            where: {
                project: {
                    id: existingProject.id
                }
            },
            order: {
                createdAt: "DESC"
            }
        })

        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionRooms,
            message: 'Get project discussion room by project success'
        })

    })


}

export default projectDiscussionRoomController