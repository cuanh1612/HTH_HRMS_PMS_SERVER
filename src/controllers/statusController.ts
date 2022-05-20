import { Request, Response } from 'express';
import { Project } from "../entities/Project";
import { Status } from "../entities/Status";
import { createOrUpdateStatusPayload } from '../type/statusPayload';
import handleCatchError from "../utils/catchAsyncError";
import { statusValid } from '../utils/valid/statusValid';



const statusController = {
    //create new status
    create: handleCatchError(async (req: Request, res: Response) => {
        const { project, title, color } = req.body

        const existingproject = await Project.findOne({
            where: {
                id: project
            }
        })
        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            })

        const status_result = await Status.create({
            project: existingproject,
            title: title,
            color: color

        }).save()

        return res.status(200).json({
            code: 200,
            success: true,
            message: status_result
        })
    }),
    //get all status by project
    getAll: handleCatchError(async (req: Request, res: Response) => {
        const { projectId } = req.params

        const findbyproject = await Status.find({
            where:{
                project: {
                    id: Number(projectId)
                }
            },
            relations:{
                tasks: true,
            },
            order: {
                index: 'ASC',              
                tasks: {
                    index: 'ASC'
                }
            }
        })


        if (!findbyproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system'
            })

        return res.status(200).json({
            code: 200,
            success: true,
            statuses: findbyproject,
            message: 'Get all status success'
        })

    }),

    //Update status
    update: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params
        const dataUpdateStatus: createOrUpdateStatusPayload = req.body


        const existingstatus = await Status.findOne({
            where: {
                id: Number(id)
            }
        })

        if (!existingstatus)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'status does not existing in the system',
            })

        const messageValid = statusValid.createOrUpdate(existingstatus, 'update')

        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid
            })

                ; (existingstatus.title = dataUpdateStatus.title),
                    (existingstatus.color = dataUpdateStatus.color)

        await existingstatus.save()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update Status success'
        })

    }),

    //Delete status
    delete: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingstatus = await Status.findOne({
            where: {
                id: Number(id)
            }
        })
        if (!existingstatus)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'status does not existing in the system',
            })

        const messageValid = statusValid.createOrUpdate(existingstatus, 'update')

        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid
            })

        existingstatus.remove()
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete status success',
        })
    }),

    //Change position of status 
    changeposition: handleCatchError(async (req: Request, res: Response) => {
        const { id1, id2 } = req.body
        console.log(id1, id2)

        // if(id2 > id1){

            const existingstatus = await Status.findOne({
                where: {
                    id: Number(id2)
                }
            })
    
            if (!existingstatus)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Either status does not exist in the system',
                })
    
            const allstatus = await Status.createQueryBuilder('status').where('status.index >= :index', {
                index: existingstatus.index
            }).getMany()
    
            if (allstatus)
                await Promise.all(
                    allstatus.map(async (status) => {
                        return new Promise(async (resolve) => {
                            const result = Status.update({
                                id: Number(status.id)
                            }, {
                                index: Number(status.index) + 1
                            })
                            resolve(result)
                        })
                    })
                )
    
            await Status.update({
                id: id1
            }, {
                index: Number(existingstatus.index) 
            })
    
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'change position of status success'
            })

        // }
        // if(id1>id2)
        // {
        //     const existingstatus = await Status.findOne({
        //         where: {
        //             id: Number(id2)
        //         }
        //     })
    
        //     if (!existingstatus)
        //         return res.status(400).json({
        //             code: 400,
        //             success: false,
        //             message: 'Either status does not exist in the system',
        //         })
    
        //     const allstatus = await Status.createQueryBuilder('status').where('status.index >= :index', {
        //         index: existingstatus.index
        //     }).getMany()
    
        //     if (allstatus)
        //         await Promise.all(
        //             allstatus.map(async (status) => {
        //                 return new Promise(async (resolve) => {
        //                     const result = Status.update({
        //                         id: Number(status.id)
        //                     }, {
        //                         index: Number(status.index) + 1
        //                     })
        //                     resolve(result)
        //                 })
        //             })
        //         )
    
        //     await Status.update({
        //         id: id1
        //     }, {
        //         index: Number(existingstatus.index) 
        //     })
    
        //     return res.status(200).json({
        //         code: 200,
        //         success: true,
        //         message: 'change position of status success'
        //     })

        // }





    })


}

export default statusController