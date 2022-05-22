import { Request, Response } from 'express'
import { Employee } from '../entities/Employee'
import { Project } from '../entities/Project'
import { Status } from '../entities/Status'
import { Task } from '../entities/Task'
import { Task_Category } from '../entities/Task_Category'
import { Task_file } from '../entities/Task_File'
import { createOrUpdateTaskPayload } from '../type/taskPayload'
import handleCatchError from '../utils/catchAsyncError'
import { taskValid } from '../utils/valid/taskValid'
// import { Request, Response } from 'express'
// import { createOrUpdateTaskPayload } from '../type/taskPayload copy'
// import handleCatchError from '../utils/catchAsyncError'
// import { taskValid } from '../utils/valid/taskValid copy'

const taskController = {
    //Create new task
    create: handleCatchError(async (req: Request, res: Response) => {
        const dataNewTask: createOrUpdateTaskPayload = req.body
        const { task_category, project, employees, task_files, status } = dataNewTask
        let taskEmployees: Employee[] = []

        //check valid
        const messageValid = taskValid.createOrUpdate(dataNewTask)

        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            })
        //check exist status
        const existingStatus = await Status.findOne({
            where: {
                id: status,
            },
        })

        if (!existingStatus)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Status does not existing',
            })

        //check exist project
        const existingproject = await Project.findOne({
            where: {
                id: project,
            },
        })
        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            })
        const existingCategories = await Task_Category.findOne({
            where: {
                id: task_category,
            },
        })
        if (!existingCategories) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task Category does not exist in the system',
            })
        }

        for (let index = 0; index < employees.length; index++) {
            const employee_id = employees[index]
            const existingEmployee = await Employee.findOne({
                where: {
                    id: employee_id,
                },
            })
            if (!existingEmployee)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Employees does not exist in the system',
                })

            //check role employee
            taskEmployees.push(existingEmployee)
        }

        const lasttask = await Task.findOne({
            where: {
                status: {
                    id: status,
                },
            },
            order: {
                index: 'DESC',
            },
        })
        var index = lasttask ? lasttask.index + 1 : 1

        //create task
        const createdTask = await Task.create({
            ...dataNewTask,
            employees: taskEmployees,
            index,
        }).save()

        if (Array.isArray(task_files)) {
            //create task files
            for (let index = 0; index < task_files.length; index++) {
                const task_file = task_files[index]
                await Task_file.create({
                    ...task_file,
                    task: task_file,
                }).save()
            }
        }

        return res.status(200).json({
            code: 200,
            success: true,
            task: createdTask,
            message: ' Create new Task success',
        })
    }),

    //Update Task
    update: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params
        const dataUpdateTask: createOrUpdateTaskPayload = req.body
        // const { task_category, project, employees} = dataUpdateTask
        const { employees } = dataUpdateTask
        let taskEmployees: Employee[] = []

        const existingtask = await Task.findOne({
            where: {
                id: Number(id),
            },
        })
        if (!existingtask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task does not exist in the system',
            })
        //check exist task category
        const existingtaskcategory = await Task.findOne({
            where: {
                id: Number(id),
            },
        })

        if (!existingtaskcategory)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task category does not exist in the system',
            })

        //check exist project
        const existingproject = await Project.findOne({
            where: {
                id: Number(id),
            },
        })

        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            })
        //Check valid input create new task
        //Check valid
        const messageValid = taskValid.createOrUpdate(dataUpdateTask)

        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            })

        for (let index = 0; index < employees.length; index++) {
            const employee_id = employees[index]
            const existingEmployee = await Employee.findOne({
                where: {
                    id: employee_id,
                },
            })
            if (!existingEmployee)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Employees does not exist in the system',
                })

            taskEmployees.push(existingEmployee)
        }

        //update task
        ; (existingtask.name = dataUpdateTask.name),
            (existingtask.project = dataUpdateTask.project),
            (existingtask.start_date = dataUpdateTask.start_date),
            (existingtask.deadline = dataUpdateTask.deadline),
            (existingtask.task_category = dataUpdateTask.task_category),
            (existingtask.employees = taskEmployees)

        await existingtask.save()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update Task success',
        })
    }),
    //Get all task
    getAll: handleCatchError(async (_: Request, res: Response) => {
        const tasks = await Task.find()
        return res.status(200).json({
            code: 200,
            success: true,
            projects: tasks,
            message: 'Get all projects success',
        })
    }),
    //Get detail task
    getDetail: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingtask = await Task.findOne({
            where: {
                id: Number(id),
            },
        })

        if (!existingtask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'task does not exist in the system',
            })

        return res.status(200).json({
            code: 200,
            success: true,
            task: existingtask,
            message: 'Get detail of task success',
        })
    }),

    //Delete task
    delete: handleCatchError(async (req: Request, res: Response) => {
        const { id } = req.params

        const existingtask = await Task.findOne({
            where: {
                id: Number(id),
            },
        })

        if (!existingtask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'task does not exist in the system',
            })

        await existingtask.remove()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete task success',
        })
    }),

    deletemany: handleCatchError(async (req: Request, res: Response) => {
        const { tasks } = req.body

        //check array of tasks
        if (!Array.isArray(tasks) || !tasks)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            })
        for (let index = 0; index < tasks.length; index++) {
            const itemtask = tasks[index]
            const existingtask = await Task.findOne({
                where: {
                    id: itemtask.id,
                },
            })
            if (existingtask) {
                await existingtask.remove()
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete tasks success',
        })
    }),

    changeposition: handleCatchError(async (req: Request, res: Response) => {
        const { id1, id2, status1, status2 } = req.body

        const existingstatus1 = Task.findOne({
            where: {
                id: status1,
            },
        })
        const existingstatus2 = Task.findOne({
            where: {
                id: status2,
            },
        })
        if (!existingstatus1 && !existingstatus2)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Either status does not existing in the system',
            })

        if (status1 == status2) {
            const task1 = await Task.createQueryBuilder('task')
                .where('task.id = :id1', { id1 })
                .getOne()
            const task2 = await Task.createQueryBuilder('task')
                .where('task.id = :id2', { id2 })
                .getOne()

            if (!task1 || !task2)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Either status does not exist in the system',
                })

            if (task1.index > task2.index) {
                const alltask = await Task.createQueryBuilder('task')
                    .where('task.index >= :index and task.statusId = :status', {
                        index: task2.index,
                        status: status1,
                    })
                    .getMany()

                if (alltask)
                    await Promise.all(
                        alltask.map(async (task) => {
                            return new Promise(async (resolve) => {
                                const result = Task.update(
                                    {
                                        id: Number(task.id),
                                    },
                                    {
                                        index: Number(task.index) + 1,
                                    }
                                )
                                resolve(result)
                            })
                        })
                    )
            }

            if (task1.index < task2.index) {
                const alltask = await Task.createQueryBuilder('task')
                    .where(
                        'task.index > :index and task.index <= :index2 and task.statusId = :status',
                        {
                            index: task1.index,
                            index2: task2.index,
                            status: status2,
                        }
                    )
                    .getMany()

                if (alltask)
                    await Promise.all(
                        alltask.map(async (task) => {
                            return new Promise(async (resolve) => {
                                task.index = task.index - 1
                                resolve(await task.save())
                            })
                        })
                    )
            }

            task1.index = task2.index
            await task1.save()

            return res.status(200).json({
                code: 200,
                success: true,
                message: 'change position of status success',
            })
        } else {
            const task1 = await Task.createQueryBuilder('task')
                .where('task.id = :id1', { id1 })
                .getOne()
            

            const status2Exist = await Status.findOne({
                where: {
                    id: status2
                }
            })

            if (!task1 || !status2Exist)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Either status does not exist in the system',
                })

            if(!id2){
                task1.index = 1
                task1.status =  status2Exist
    
                await task1.save()
    
                return res.status(200).json({
                    code: 200,
                    success: true,
                    message: 'change position of status success',
                })
            }
            
            const task2 = await Task.createQueryBuilder('task')
                .where('task.id = :id2', { id2 })
                .getOne()
            const index = task2?.index

            const alltask = await Task.createQueryBuilder('task').where(
                'task.statusId = :status and task.index >= :index',
                { status: status2, index: task2?.index }
            ).getMany()

            if (alltask)
                await Promise.all(
                    alltask.map(async (task) => {
                        return new Promise(async (resolve) => {
                            task.index = task.index + 1
                            resolve(await task.save())
                        })
                    })
                )

            task1.index = Number(index)
            task1.status =  status2Exist

            await task1.save()

            return res.status(200).json({
                code: 200,
                success: true,
                message: 'change position of status success',
            })

        }
    }),
}

export default taskController
//     //Create new task
//     create: handleCatchError(async (req: Request, res: Response) =>{
//         const dataNewTask: createOrUpdateTaskPayload = req.body
//         const { task_category, project, employees, task_files} = dataNewTask

//         //check valid
//         const messageValid = taskValid.createOrUpdate(dataNewTask)
//     })
// }

// export default taskController
