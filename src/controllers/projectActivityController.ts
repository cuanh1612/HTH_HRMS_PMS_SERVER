import handleCatchError from "../utils/catchAsyncError"
import { Request, Response } from 'express'
import { Project } from "../entities/Project"
import { Project_Activity } from "../entities/Project_Activity"


const projectActivityController = {
    getByProject: handleCatchError(async (req: Request, res: Response) => {
        const {projectId} = req.params

        const existingProject = await Project.findOne({
            where: {
                id: Number(projectId)
            }
        })

        if(!existingProject)
        return res.status(400).json({
            code: 400,
            status: false,
            message: 'Project does not existing in the system'
        })

        const projectActivity = await Project_Activity.find({
            where: {
                project: {
                    id: existingProject.id,
                }
            },
            order: {
                createdAt: 'DESC'   
            }
        })

        return res.status(200).json({
            code: 200,
            status: true,
            projectActivity,
            message: 'get activities by project success'
        })
    })
}

export default projectActivityController