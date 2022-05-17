<<<<<<< HEAD
import { Request, Response } from 'express'
import { Employee } from '../entities/Employee'
import { Project } from '../entities/Project'
import { Task } from '../entities/Task'
import { Task_Category } from '../entities/Task_Category'
import { Task_file } from '../entities/Task_File'
import { createOrUpdateTaskPayload } from '../type/taskPayload'
import handleCatchError from '../utils/catchAsyncError'
import { taskValid } from '../utils/valid/taskValid'
=======
// import { Request, Response } from 'express'
// import { createOrUpdateTaskPayload } from '../type/taskPayload copy'
// import handleCatchError from '../utils/catchAsyncError'
// import { taskValid } from '../utils/valid/taskValid copy'
>>>>>>> fdeb6aa819f872be90108d0c1efe5ee7240bdc21


// const taskController = {

<<<<<<< HEAD
    //Create new task
    create: handleCatchError(async (req: Request, res: Response) =>{
        const dataNewTask: createOrUpdateTaskPayload = req.body
        const { task_category, project, employees, task_files} = dataNewTask
        let taskEmployees: Employee[] = []
    
        //check valid 
        const messageValid = taskValid.createOrUpdate(dataNewTask)

        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
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
                id: task_category
            },
        })
        if (!existingCategories)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Task Category does not exist in the system',
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
    
                //check role employee
                taskEmployees.push(existingEmployee)
            }
        //create taskfile
        const createdTask = await Task.create({
            ...dataNewTask,
            employees: taskEmployees
        }).save()

            //create task files
            for (let index = 0; index < task_files.length; index++) {
                const task_file = task_files[index];
                await Task_file.create({
                    ...task_file,
                    task: task_file
                }).save()
            }
        return res.status(200).json({
            code: 200,
            success: true,
            task: createdTask,
            message: ' Create new Task success'
        })
	}),

    //Update Task
    update: handleCatchError( async(req: Request, res: Response) =>{
        const {id} = req.params
        const dataUpdateTask: createOrUpdateTaskPayload = req.body
        // const { task_category, project, employees} = dataUpdateTask
        const {employees} = dataUpdateTask
        let taskEmployees: Employee[] = []

        const existingtask = await Task.findOne({
            where: {
                id: Number(id),
            },
        })
        if(!existingtask)
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

        if(!existingtaskcategory)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task category does not exist in the system'
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
            ;(existingtask.name = dataUpdateTask.name),
                 (existingtask.project = dataUpdateTask.project),
                 (existingtask.start_date = dataUpdateTask.start_date),
                 (existingtask.deadline = dataUpdateTask.deadline),
                 (existingtask.task_category = dataUpdateTask.task_category),
            existingtask.employees = taskEmployees
            
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

    


}


export default taskController
=======
//     //Create new task
//     create: handleCatchError(async (req: Request, res: Response) =>{
//         const dataNewTask: createOrUpdateTaskPayload = req.body
//         const { task_category, project, employees, task_files} = dataNewTask
        
//         //check valid 
//         const messageValid = taskValid.createOrUpdate(dataNewTask)
//     })
// }

// export default taskController
>>>>>>> fdeb6aa819f872be90108d0c1efe5ee7240bdc21
