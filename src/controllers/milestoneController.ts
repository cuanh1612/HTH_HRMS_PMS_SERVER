import { Request, Response } from "express";
import { Milestone } from "../entities/Milestone";
import { Project } from "../entities/Project";
import handleCatchError from "../utils/catchAsyncError";

const mileStoneController = {
    create: handleCatchError(async (req: Request, res: Response) => {
        const { title, summary, project, cost } = req.body

        const existingProject = await Project.findOne({
            where: {
                id: Number(project)
            }
        })

        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not existing',
            })

        if (!title)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter title of milestone',
            })

        await Milestone.create({
            title: title,
            summary: summary,
            project: project,
            cost: Number(cost)
        }).save()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create milestone success'
        })
    }),
    update: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params
        const dataUpdateMileStone: Milestone = req.body

        const existingMileStone = await Milestone.findOne({
            where: {
                id: Number(id)
            }
        })

        if (!existingMileStone)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Milestone does not existing in the system',
            })

        existingMileStone.title = dataUpdateMileStone.title
        existingMileStone.summary = dataUpdateMileStone.summary
        existingMileStone.cost = dataUpdateMileStone.cost
        existingMileStone.addtobudget = dataUpdateMileStone.addtobudget
        existingMileStone.status = dataUpdateMileStone.status

        await existingMileStone.save()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update milestone successfully',
        })

    }),


    getByProjectWithTask: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingProject = await Project.findOne({
            where: {
                id: Number(id)
            }
        })

        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not existing',
            })


        const existingMileStones = await Milestone.find({
            where: {
                project: {
                    id: Number(id)
                }
            },
            relations: {
                tasks: true
            }
        })

        if (!existingMileStones)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system'
            })

        return res.status(200).json({
            code: 200,
            success: true,
            milestones: existingMileStones,
            message: 'Get milestones by project success'
        })

    }),

    getByProject: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingProject = await Project.findOne({
            where: {
                id: Number(id)
            }
        })

        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not existing',
            })


        const existingMileStones = await Milestone.find({
            where: {
                project: {
                    id: Number(id)
                }
            }
        })

        if (!existingMileStones)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system'
            })

        return res.status(200).json({
            code: 200,
            success: true,
            milestones: existingMileStones,
            message: 'Get milestones by project success'
        })

    }),

    getDetail: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingMileStone = await Milestone.findOne({
            where: {
                id: Number(id),
            },
            relations: {
                tasks: true,
            }

        })

        if (!existingMileStone)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system'
            })
        return res.status(200).json({
            code: 200,
            success: true,
            milestones: existingMileStone,
            message: 'Get milestones by project success'
        })



    }),

    delete: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingMileStone = await Milestone.findOne({
            where: {
                id: Number(id)
            }
        })

        if (!existingMileStone)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system'
            })

        await existingMileStone.remove()
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete of milestone success'
        })
    }),

}

export default mileStoneController