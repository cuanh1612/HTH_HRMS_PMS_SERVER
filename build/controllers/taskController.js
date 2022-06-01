"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Employee_1 = require("../entities/Employee");
const Milestone_1 = require("../entities/Milestone");
const Project_1 = require("../entities/Project");
const Status_1 = require("../entities/Status");
const Task_1 = require("../entities/Task");
const Task_Category_1 = require("../entities/Task_Category");
const Task_File_1 = require("../entities/Task_File");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const taskValid_1 = require("../utils/valid/taskValid");
const taskController = {
    //Create new task
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewTask = req.body;
        const { task_category, project, employees, task_files, status, milestone, assignBy } = dataNewTask;
        let taskEmployees = [];
        //check valid
        const messageValid = taskValid_1.taskValid.createOrUpdate(dataNewTask);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //check exist status
        const existingStatus = yield Status_1.Status.findOne({
            where: {
                id: status,
            },
        });
        if (!existingStatus)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Status does not existing',
            });
        //check exist project
        const existingproject = yield Project_1.Project.findOne({
            where: {
                id: project,
            },
        });
        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Check exist task category
        const existingCategories = yield Task_Category_1.Task_Category.findOne({
            where: {
                id: task_category,
            },
        });
        if (!existingCategories) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task Category does not exist in the system',
            });
        }
        //Check exist milestone
        if (milestone) {
            const existingMilestone = yield Milestone_1.Milestone.findOne({
                where: {
                    id: milestone,
                },
            });
            if (!existingMilestone) {
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Milestone does not exist in the system',
                });
            }
        }
        // check employee who create task
        if (!assignBy)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee who create task does not exist in the system',
            });
        const assignByUser = Employee_1.Employee.findOne({
            where: {
                id: Number(assignBy),
            },
        });
        if (!assignByUser) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee who create task does not exist in the system',
            });
        }
        for (let index = 0; index < employees.length; index++) {
            const employee_id = employees[index];
            const existingEmployee = yield Employee_1.Employee.findOne({
                where: {
                    id: employee_id,
                },
            });
            if (!existingEmployee)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Employees does not exist in the system',
                });
            //check role employee
            taskEmployees.push(existingEmployee);
        }
        const lasttask = yield Task_1.Task.findOne({
            where: {
                status: {
                    id: status,
                },
            },
            order: {
                index: 'DESC',
            },
        });
        var index = lasttask ? lasttask.index + 1 : 1;
        //create task
        const createdTask = yield Task_1.Task.create(Object.assign(Object.assign({}, dataNewTask), { employees: taskEmployees, index, assignBy: {
                id: Number(assignBy),
            } })).save();
        if (Array.isArray(task_files)) {
            //create task files
            for (let index = 0; index < task_files.length; index++) {
                const task_file = task_files[index];
                yield Task_File_1.Task_file.create(Object.assign(Object.assign({}, task_file), { task: task_file })).save();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            task: createdTask,
            message: ' Create new Task success',
        });
    })),
    //Update Task
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateTask = req.body;
        // const { task_category, project, employees} = dataUpdateTask
        const { employees, status, project, milestone } = dataUpdateTask;
        let taskEmployees = [];
        const existingtask = yield Task_1.Task.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingtask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task does not exist in the system',
            });
        const existingStatus = yield Status_1.Status.findOne({
            where: {
                id: Number(status),
            },
        });
        if (!existingStatus)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task does not exist in the system',
            });
        const lasttask = yield Task_1.Task.findOne({
            where: {
                status: {
                    id: status,
                },
            },
            order: {
                index: 'DESC',
            },
        });
        var index = lasttask ? lasttask.index + 1 : 1;
        //check exist project
        const existingproject = yield Project_1.Project.findOne({
            where: {
                id: Number(project),
            },
        });
        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Check valid input create new task
        //Check valid
        const messageValid = taskValid_1.taskValid.createOrUpdate(dataUpdateTask);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        for (let index = 0; index < employees.length; index++) {
            const employee_id = employees[index];
            const existingEmployee = yield Employee_1.Employee.findOne({
                where: {
                    id: employee_id,
                },
            });
            if (!existingEmployee)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Employees does not exist in the system',
                });
            taskEmployees.push(existingEmployee);
        }
        //Check exist milestone
        if (milestone) {
            const existingMilestone = yield Milestone_1.Milestone.findOne({
                where: {
                    id: milestone,
                },
            });
            if (!existingMilestone) {
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Milestone does not exist in the system',
                });
            }
            else {
                existingtask.milestone = existingMilestone;
            }
        }
        //update task
        ;
        (existingtask.name = dataUpdateTask.name),
            (existingtask.project = dataUpdateTask.project),
            (existingtask.start_date = new Date(new Date(dataUpdateTask.start_date).toLocaleDateString())),
            (existingtask.deadline = new Date(new Date(dataUpdateTask.deadline).toLocaleDateString())),
            (existingtask.task_category = dataUpdateTask.task_category),
            (existingtask.employees = taskEmployees),
            (existingtask.index = index),
            (existingtask.status = existingStatus),
            (existingtask.description = dataUpdateTask.description
                ? dataUpdateTask.description
                : ''),
            (existingtask.priority = dataUpdateTask.priority);
        yield existingtask.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update Task success',
        });
    })),
    // get all task and show in calendar
    calendar: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employee, client, name, project } = req.query;
        console.log('hoang nguyen dsf d s sse ', req.query);
        var filter = {};
        if (name)
            filter.name = (0, typeorm_1.Like)(String(name));
        if (employee)
            filter.employees = {
                id: Number(employee),
            };
        if (project)
            filter.project = Object.assign(Object.assign({}, filter.project), { id: project });
        if (client)
            filter.project = Object.assign(Object.assign({}, filter.project), { client: {
                    id: client,
                } });
        const tasks = yield Task_1.Task.find({
            where: filter,
            relations: {
                status: true,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            tasks,
            message: 'Get all projects success',
        });
    })),
    //Get all task
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tasks = yield Task_1.Task.find({
            select: {
                time_logs: {
                    total_hours: true,
                },
                project: {
                    name: true,
                    id: true,
                },
                milestone: {
                    id: true,
                    title: true,
                },
            },
            relations: {
                time_logs: true,
                project: true,
                employees: true,
                status: true,
                milestone: true,
                assignBy: true,
                task_category: true,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            tasks,
            message: 'Get all projects success',
        });
    })),
    //Get detail task
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingtask = yield Task_1.Task.findOne({
            where: {
                id: Number(id),
            },
            relations: {
                project: true,
                task_category: true,
                status: true,
                employees: true,
                milestone: true,
                assignBy: true,
            },
        });
        if (!existingtask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'task does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            task: existingtask,
            message: 'Get detail of task success',
        });
    })),
    //Delete task
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingtask = yield Task_1.Task.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingtask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'task does not exist in the system',
            });
        yield existingtask.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete task success',
        });
    })),
    deletemany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { tasks } = req.body;
        //check array of tasks
        if (!Array.isArray(tasks) || !tasks)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        for (let index = 0; index < tasks.length; index++) {
            const itemtask = tasks[index];
            const existingtask = yield Task_1.Task.findOne({
                where: {
                    id: itemtask.id,
                },
            });
            if (existingtask) {
                yield existingtask.remove();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete tasks success',
        });
    })),
    changeposition: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id1, id2, status1, status2 } = req.body;
        const existingstatus1 = Task_1.Task.findOne({
            where: {
                id: status1,
            },
        });
        const existingstatus2 = Task_1.Task.findOne({
            where: {
                id: status2,
            },
        });
        if (!existingstatus1 && !existingstatus2)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Either status does not existing in the system',
            });
        if (status1 == status2) {
            const task1 = yield Task_1.Task.createQueryBuilder('task')
                .where('task.id = :id1', { id1 })
                .getOne();
            const task2 = yield Task_1.Task.createQueryBuilder('task')
                .where('task.id = :id2', { id2 })
                .getOne();
            if (!task1 || !task2)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Either status does not exist in the system',
                });
            if (task1.index > task2.index) {
                const alltask = yield Task_1.Task.createQueryBuilder('task')
                    .where('task.index >= :index and task.statusId = :status', {
                    index: task2.index,
                    status: status1,
                })
                    .getMany();
                if (alltask)
                    yield Promise.all(alltask.map((task) => __awaiter(void 0, void 0, void 0, function* () {
                        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                            const result = Task_1.Task.update({
                                id: Number(task.id),
                            }, {
                                index: Number(task.index) + 1,
                            });
                            resolve(result);
                        }));
                    })));
            }
            if (task1.index < task2.index) {
                const alltask = yield Task_1.Task.createQueryBuilder('task')
                    .where('task.index > :index and task.index <= :index2 and task.statusId = :status', {
                    index: task1.index,
                    index2: task2.index,
                    status: status2,
                })
                    .getMany();
                if (alltask)
                    yield Promise.all(alltask.map((task) => __awaiter(void 0, void 0, void 0, function* () {
                        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                            task.index = task.index - 1;
                            resolve(yield task.save());
                        }));
                    })));
            }
            task1.index = task2.index;
            yield task1.save();
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'change position of status success',
            });
        }
        else {
            const task1 = yield Task_1.Task.createQueryBuilder('task')
                .where('task.id = :id1', { id1 })
                .getOne();
            const status2Exist = yield Status_1.Status.findOne({
                where: {
                    id: status2,
                },
            });
            if (!task1 || !status2Exist)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Either status does not exist in the system',
                });
            if (!id2) {
                const lastTask = yield Task_1.Task.findOne({
                    where: {
                        status: {
                            id: status2,
                        },
                    },
                    order: {
                        index: 'DESC',
                    },
                });
                task1.index = lastTask ? lastTask.index + 1 : 1;
                task1.status = status2Exist;
                yield task1.save();
                return res.status(200).json({
                    code: 200,
                    success: true,
                    message: 'change position of status success',
                });
            }
            const task2 = yield Task_1.Task.createQueryBuilder('task')
                .where('task.id = :id2', { id2 })
                .getOne();
            const index = task2 === null || task2 === void 0 ? void 0 : task2.index;
            const alltask = yield Task_1.Task.createQueryBuilder('task')
                .where('task.statusId = :status and task.index >= :index', {
                status: status2,
                index: task2 === null || task2 === void 0 ? void 0 : task2.index,
            })
                .getMany();
            if (alltask)
                yield Promise.all(alltask.map((task) => __awaiter(void 0, void 0, void 0, function* () {
                    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                        task.index = task.index + 1;
                        resolve(yield task.save());
                    }));
                })));
            task1.index = Number(index);
            task1.status = status2Exist;
            yield task1.save();
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'change position of status success',
            });
        }
    })),
    getByProject: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId } = req.params;
        //Check exist project
        const exisitingProject = yield Project_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
        });
        if (!exisitingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Get tasks by project
        const tasks = yield Task_1.Task.find({
            select: {
                time_logs: {
                    total_hours: true,
                },
                project: {
                    name: true,
                },
                milestone: {
                    id: true,
                    title: true,
                },
            },
            where: {
                project: {
                    id: exisitingProject.id,
                },
            },
            relations: {
                time_logs: true,
                project: true,
                employees: true,
                status: true,
                milestone: true,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            tasks,
            message: 'Get tasks by projects successfully',
        });
    })),
    //huy
    getByEmployee: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check exist employee
        const exisitingEmployee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!exisitingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        //Get tasks by employee
        const tasksAssigned = yield Task_1.Task.find({
            select: {
                time_logs: {
                    total_hours: true,
                },
                project: {
                    name: true,
                },
                milestone: {
                    id: true,
                    title: true,
                },
            },
            where: {
                employees: {
                    id: exisitingEmployee.id,
                },
            },
            relations: {
                time_logs: true,
                project: true,
                employees: true,
                status: true,
                milestone: true,
                assignBy: true
            },
        });
        //Task was creted by current user
        const tasksWasCreated = yield Task_1.Task.find({
            select: {
                time_logs: {
                    total_hours: true,
                },
                project: {
                    name: true,
                },
                milestone: {
                    id: true,
                    title: true,
                },
            },
            where: {
                assignBy: {
                    id: exisitingEmployee.id,
                },
            },
            relations: {
                time_logs: true,
                project: true,
                employees: true,
                status: true,
                milestone: true,
                assignBy: true
            },
        });
        // merge arrays
        // using the concat() method
        // concat() method returns a new array
        const tasksMerge = tasksAssigned.concat(tasksWasCreated);
        // use Set() constructor function
        // to remove duplicate or repaeted elements
        const uniqueTasks = new Set(tasksMerge);
        // use the spread operator ...
        // to extract values from Set collection
        // to an array
        const tasks = [...uniqueTasks];
        return res.status(200).json({
            code: 200,
            success: true,
            tasks,
            message: 'Get tasks by employee successfully',
        });
    })),
};
exports.default = taskController;
