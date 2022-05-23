import { Request, Response } from 'express';
import { Task } from "../entities/Task";
import { Task_file } from "../entities/Task_File";
import { createOrUpdatetTaskFilesPayload } from "../type/taskFilePayLoad copy";
import handleCatchError from "../utils/catchAsyncError";





const taskFileController = {
    create: handleCatchError(async (req: Request, res: Response) => {
        const { files, task } = req.body as createOrUpdatetTaskFilesPayload

        //check exist task
        const existingTask = await Task.findOne({
            where: {
                id: task,
            }
        })
        if (!existingTask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This task does not exist in the system',
            })
        if (Array.isArray(files)) {
            
            files.map(async (file) => {
                await Task_file.create({
                    ...file,
                    task: existingTask
                }).save()
            })
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new task files success'
        })
    }),
    delete: handleCatchError(async (req: Request, res: Response) => {
        const { taskFileId, taskId } = req.params

        const existingTask = await Task.findOne({
            where: {
                id: Number(taskId),
            },
        })
        if (!existingTask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This task does not existing in the system'
            })

        //check existing task file
        const existingTaskFile = await Task_file.findOne({
            where: {
                id: Number(taskFileId),
                task: {
                    id: Number(taskId),
                }
            }
        })
        if (!existingTaskFile)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This task file does not existing in the system'
            })
        //delete task file 
        await existingTaskFile.remove()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete task file success'
        })
    }),
    getAll: handleCatchError(async (req: Request, res: Response) => {
		const {taskId } = req.params

        //Check existtask
		const existingtask = await Task.findOne({
			where: {
				id: Number(taskId),
			},
		})

		if (!existingtask)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract does not exist in the system',
			})

        //Get alltask file 
        const taskFiles = await Task_file.find({
            where: {
               task: {
                    id: Number(taskId)
                }
            },
            order: {
                createdAt: "DESC"
            }
        })

        return res.status(200).json({
			code: 200,
			success: true,
           taskFiles,
			message: 'Get all contract files success successfully',
		})
	}),
    changeposition: handleCatchError(async (req: Request, res: Response) => {
        const { status1, task1, status2, task2}:{[index: string]:number} = req.body
        console.log(status1)

        if(status1 == status2){
            const existingtask = await Task.findOne({
                where: {
                    id: Number(task2),
                    status: {
                        id: status2
                    }
                }
            })
    
            if (!existingtask)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Either task does not exist in the system',
                })
    
            const alltask = await Task.createQueryBuilder('task').where('task.index >= :index', {
                index: existingtask.index
            }).getMany()
    
            if (alltask)
                await Promise.all(
                    alltask.map(async (task) => {
                        return new Promise(async (resolve) => {
                            const result = Task.update({
                                id: Number(task.id), status:{
                                    id: status2
                                }
                            }, {
                                index: Number(task.index) + 1
                            })
                            resolve(result)
                        })
                    })
                )
    
            await Task.update({
                id: task1,
                status:{
                    id: status1
                }
            }, {
                index: Number(existingtask.index) 
            })
    
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'change position of task success'
            })
        }
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Either task does not exist in the system',
        })
    })
}
export default taskFileController
