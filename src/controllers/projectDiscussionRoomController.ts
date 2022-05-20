import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Employee } from '../entities/Employee'
import { Project } from '../entities/Project'
import { Project_discussion_category } from '../entities/Project_Discussion_Category'
import { Project_discussion_reply } from '../entities/Project_Discussion_Reply'
import { Project_Discussion_Room } from '../entities/Project_Discussion_Room'
import { createOrUpdateProjectDiscussionRoomPayload } from '../type/createOrUpdateProjectDiscussionRoomPayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'
import { projectDiscussionRoomValid } from '../utils/valid/project_discussion_payload'


const projectDiscussionRoomController = {
    create: handleCatchError(async (req: Request, res: Response) => {
        const dataNewPdiscussionRoom: createOrUpdateProjectDiscussionRoomPayload = req.body
        const { project, project_discussion_category, description } = dataNewPdiscussionRoom
        const messageValid = projectDiscussionRoomValid.createOrUpdate(dataNewPdiscussionRoom)

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


        if (!existingProject.employees.some((employeeItem) => employeeItem.id === existingUser.id))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You not have authorization'
            })

        if (project_discussion_category) {
            //check exist project discussion category
            const existingpdCategory = await Project_discussion_category.findOne({
                where: {
                    id: project_discussion_category
                }
            })
            if (!existingpdCategory)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Project Discussion Category does not exist in the system'
                })
        }

        const createRoom = await Project_Discussion_Room.create({
            ...dataNewPdiscussionRoom,
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
        const existingDiscussionroom = await Project_Discussion_Room.findOne({
            where: {
                id: Number(id)
            }
        })

        if (!existingDiscussionroom)
            return res.status(400).json({
                code: 400,
                success: false,
                message: ' Project discussion room does not exist in the system'
            })

        //get project
        const existingProject = await Project.findOne({
            where: {
                id: existingDiscussionroom.project.id
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


        await existingDiscussionroom.remove()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'delete project discussion room success'
        })
    }),

    getDetail: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params
        const existingDiscussionroom = await Project_Discussion_Room.findOne({
            where: {
                id: Number(id)
            }

        })
        if (!existingDiscussionroom)
            return res.status(400).json({
                code: 400,
                success: false,
                message: ' Project discussion room does not exist in the system'
            })

        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionRoom: existingDiscussionroom,
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