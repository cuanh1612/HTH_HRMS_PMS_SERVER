import { Request, Response } from 'express'
import { createOrUpdateTaskPayload } from '../type/taskPayload copy'
import handleCatchError from '../utils/catchAsyncError'
import { taskValid } from '../utils/valid/taskValid copy'


const taskController = {

    //Create new task
    create: handleCatchError(async (req: Request, res: Response) =>{
        const dataNewTask: createOrUpdateTaskPayload = req.body
        const { task_category, project, employees, task_files} = dataNewTask
        
        //check valid 
        const messageValid = taskValid.createOrUpdate(dataNewTask)
    })
}

export default taskController