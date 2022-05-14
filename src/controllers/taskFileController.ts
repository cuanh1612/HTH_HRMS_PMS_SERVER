import handleCatchError from "../utils/catchAsyncError";
import { Task } from "../entities/Task";
import { Task_file } from "../entities/Task_File";
import { createOrUpdatetTaskFilesPayload } from "../type/taskFilePayLoad copy";
import { Request, Response } from 'express'
import { transpileModule } from "typescript";




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
                    ...files,
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
        const { taskFileID, taskId } = req.params

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
                id: Number(taskFileID),
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
}
export default taskFileController
