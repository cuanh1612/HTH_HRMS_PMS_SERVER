import handleCatchError from "../utils/catchAsyncError";
import { Request, Response } from 'express'
import { createOrUpdateProjectDiscussionreplyPayload } from "../type/ProjectDiscussionReplyPayload";
import { Employee } from "../entities/Employee";
import { Project_Discussion_Room } from "../entities/Project_Discussion_Room";
import { Project } from "../entities/Project";
import { Project_discussion_reply } from "../entities/Project_Discussion_Reply";


const projectDiscussionReplyController = {
    //create new discussion reply
    create: handleCatchError(async (req: Request, res: Response) =>{
        const dataNewDiscussionReply: createOrUpdateProjectDiscussionreplyPayload = req.body
        const { employee, project, project_discussion_room} = dataNewDiscussionReply

        //check project discussion room 
        const existingProjectDiscussionRoom = await Project_Discussion_Room.findOne({
            where: {
                id: project_discussion_room
            }
        })

        if(!existingProjectDiscussionRoom)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project discussion room does not exist in the system'
            })
        
        //check project exists
        const existingProject = await Project.findOne({
            where: {
                id: project
            }
        })

        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            })

        //check employee exists
        const existingEmployee = await Employee.findOne({
            where: {
                id: employee,
            },
        })

        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            })
    
        if (!existingProject.employees.some((employee) => employee.id === existingEmployee.id))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the discussion room'
            })
        
        const createdDiscussionReply = await Project_discussion_reply.create({
            ...dataNewDiscussionReply,
        }).save
        
        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionReply: createdDiscussionReply,
        })
            
    }),

    getByProjectDiscussion: handleCatchError(async ( req: Request, res: Response) => {
        const { projectDiscussionRoomId} = req.params

        //check exist project discussion room
        const existingprojectDiscussionRoom = await Project_Discussion_Room.findOne({
            where: {
                id: Number(projectDiscussionRoomId),
            }
        })

        if(!existingprojectDiscussionRoom)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project discussion roome does not exist in the system'
            })
        
        const replies = await Project_discussion_reply.find({
            where: {
                project_discussion_room: {id: existingprojectDiscussionRoom.id}
            },
            order: {
                createdAt: 'ASC',
            },
        })

        return res.status(200).json({
            code: 200,
            success: true,
            replies,
            message: 'Get replies by project discussion success'
        })
    }),
}

export default projectDiscussionReplyController