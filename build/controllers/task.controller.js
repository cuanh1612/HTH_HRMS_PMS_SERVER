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
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const Employee_entity_1 = require("../entities/Employee.entity");
const Milestone_entity_1 = require("../entities/Milestone.entity");
const Notification_entity_1 = require("../entities/Notification.entity");
const Project_entity_1 = require("../entities/Project.entity");
const Status_entity_1 = require("../entities/Status.entity");
const Task_entity_1 = require("../entities/Task.entity");
const Task_Category_entity_1 = require("../entities/Task_Category.entity");
const Task_File_entity_1 = require("../entities/Task_File.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const helper_1 = require("../utils/helper");
const taskValid_1 = require("../utils/valid/taskValid");
const taskController = {
    //Create new task
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const dataNewTask = req.body;
        const { task_category, project, employees, task_files, status, milestone, assignBy, name } = dataNewTask;
        let taskEmployees = [];
        //check exist current user
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        //check valid
        const messageValid = taskValid_1.taskValid.createOrUpdate(dataNewTask);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //check exist status
        const existingStatus = yield Status_entity_1.Status.findOne({
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
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: project,
            },
            relations: {
                project_Admin: true,
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        if (existingUser.role !== 'Admin' &&
            existingProject.project_Admin.email !== existingUser.email)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this operation',
            });
        //Check existing name
        const existingTaskName = yield Task_entity_1.Task.findOne({
            where: {
                project: {
                    id: existingProject.id,
                },
                name: name,
            },
        });
        if (existingTaskName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task name already existing in this project',
            });
        //Check exist task category
        const existingCategories = yield Task_Category_entity_1.Task_Category.findOne({
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
            const existingMilestone = yield Milestone_entity_1.Milestone.findOne({
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
        const assignByUser = Employee_entity_1.Employee.findOne({
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
        yield Promise.all(employees.map((employee_id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingEmployee = yield Employee_entity_1.Employee.findOne({
                    where: {
                        id: employee_id,
                    },
                });
                if (existingEmployee)
                    //check role employee
                    taskEmployees.push(existingEmployee);
                resolve(true);
            }));
        })));
        const lastTask = yield Task_entity_1.Task.findOne({
            where: {
                status: {
                    id: status,
                },
            },
            order: {
                index: 'DESC',
            },
        });
        var index = lastTask ? lastTask.index + 1 : 1;
        //create task
        const createdTask = yield Task_entity_1.Task.create(Object.assign(Object.assign({}, dataNewTask), { employees: taskEmployees, index, assignBy: {
                id: Number(assignBy),
            } })).save();
        if (Array.isArray(task_files)) {
            //create task files
            for (let index = 0; index < task_files.length; index++) {
                const task_file = task_files[index];
                yield Task_File_entity_1.Task_file.create(Object.assign(Object.assign({}, task_file), { task: task_file })).save();
            }
        }
        //Huy lam - create notification for employee
        yield Promise.all(taskEmployees.map((employee) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //create notification
                yield Notification_entity_1.Notification.create({
                    employee,
                    url: `/projects/${existingProject.id}/tasks-table`,
                    content: 'You have just been assigned to a new task',
                }).save();
                resolve(true);
            }));
        })));
        yield (0, helper_1.CreateProjectActivity)(res, existingProject.id, "New Task Added To The Project");
        return res.status(200).json({
            code: 200,
            success: true,
            task: createdTask,
            message: ' Create new Task success',
        });
    })),
    //Update Task
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { id } = req.params;
        const dataUpdateTask = req.body;
        // const { task_category, project, employees} = dataUpdateTask
        const { employees, status, project, milestone, name } = dataUpdateTask;
        let taskEmployees = [];
        //check exist current user
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        const existingTask = yield Task_entity_1.Task.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingTask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task does not exist in the system',
            });
        const existingStatus = yield Status_entity_1.Status.findOne({
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
        const lastTask = yield Task_entity_1.Task.findOne({
            where: {
                status: {
                    id: status,
                },
            },
            order: {
                index: 'DESC',
            },
        });
        var index = lastTask ? lastTask.index + 1 : 1;
        //check exist project
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(project),
            },
            relations: {
                project_Admin: true,
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Check role admin or project admin
        if (existingUser.role !== 'Admin' &&
            existingProject.project_Admin.email !== existingUser.email)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this operation',
            });
        //Check existing name
        const existingTaskName = yield Task_entity_1.Task.findOne({
            where: {
                project: {
                    id: existingProject.id,
                },
                name: name,
            },
        });
        if (existingTaskName && (existingTaskName === null || existingTaskName === void 0 ? void 0 : existingTaskName.id) !== existingTask.id)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task name already existing in this project',
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
        yield Promise.all(employees.map((employee_id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingEmployee = yield Employee_entity_1.Employee.findOne({
                    where: {
                        id: employee_id,
                    },
                });
                if (existingEmployee)
                    //check role employee
                    taskEmployees.push(existingEmployee);
                resolve(true);
            }));
        })));
        //Check exist milestone
        if (milestone) {
            const existingMilestone = yield Milestone_entity_1.Milestone.findOne({
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
                existingTask.milestone = existingMilestone;
            }
        }
        //update task
        ;
        (existingTask.name = dataUpdateTask.name),
            (existingTask.project = dataUpdateTask.project),
            (existingTask.start_date = new Date(dataUpdateTask.start_date)),
            (existingTask.deadline = new Date(dataUpdateTask.deadline)),
            (existingTask.employees = taskEmployees),
            (existingTask.index = index),
            (existingTask.status = existingStatus),
            (existingTask.description = dataUpdateTask.description
                ? dataUpdateTask.description
                : ''),
            (existingTask.priority = dataUpdateTask.priority);
        yield existingTask.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update Task success',
        });
    })),
    // get all task and show in calendar
    calendar: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employee, client, name, project } = req.query;
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
        const tasks = yield Task_entity_1.Task.find({
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
    // get all task and show in calendar
    calendarByEmployee: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { client, name, project } = req.query;
        const { employeeId } = req.params;
        //Check exist employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        var filter = {};
        filter.employees = {
            id: existingEmployee.id,
        };
        if (name)
            filter.name = (0, typeorm_1.Like)(String(name));
        if (project)
            filter.project = Object.assign(Object.assign({}, filter.project), { id: project });
        if (client)
            filter.project = Object.assign(Object.assign({}, filter.project), { client: {
                    id: client,
                } });
        const tasks = yield Task_entity_1.Task.find({
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
        const tasks = yield Task_entity_1.Task.find({
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
        const existingTask = yield Task_entity_1.Task.findOne({
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
        if (!existingTask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'task does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            task: existingTask,
            message: 'Get detail of task success',
        });
    })),
    //Delete task
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const { id } = req.params;
        //check exist current user
        const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        const existingTask = yield Task_entity_1.Task.findOne({
            where: {
                id: Number(id),
            },
            relations: {
                project: {
                    project_Admin: true,
                },
            },
        });
        if (!existingTask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'task does not exist in the system',
            });
        //Check role admin or project admin
        if (existingUser.role !== 'Admin' &&
            existingTask.project.project_Admin.email !== existingUser.email)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this operation',
            });
        yield existingTask.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete task success',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const { tasks } = req.body;
        //check array of tasks
        if (!Array.isArray(tasks) || !tasks)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //check exist current user
        const token = (_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        yield Promise.all(tasks.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingtask = yield Task_entity_1.Task.findOne({
                    where: {
                        id: id,
                    },
                    relations: {
                        project: {
                            project_Admin: true,
                        },
                    },
                });
                if (existingtask) {
                    //Check role admin or projectt admin
                    if (existingUser.role !== 'Admin' &&
                        existingtask.project.project_Admin.email !== existingUser.email)
                        return res.status(400).json({
                            code: 400,
                            success: false,
                            message: 'You do not have permission to perform this operation',
                        });
                    yield Task_entity_1.Task.remove(existingtask);
                }
                return resolve(true);
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete tasks success',
        });
    })),
    changePosition: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        const { id1, id2, status1, status2 } = req.body;
        //check exist current user
        const token = (_e = req.headers.authorization) === null || _e === void 0 ? void 0 : _e.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        const existingStatus1 = yield Status_entity_1.Status.findOne({
            where: {
                id: status1,
            },
            relations: {
                project: {
                    project_Admin: true,
                },
            },
        });
        const existingStatus2 = yield Status_entity_1.Status.findOne({
            where: {
                id: status2,
            },
            relations: {
                project: {
                    project_Admin: true,
                },
            },
        });
        if (!existingStatus1 && !existingStatus2)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Either status does not existing in the system 3',
            });
        //Check role admin or project admin
        if (existingUser.role !== 'Admin' &&
            ((existingStatus1 &&
                existingStatus1.project.project_Admin.email !== existingUser.email) ||
                (existingStatus2 &&
                    existingStatus2.project.project_Admin.email !== existingUser.email)))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this operation',
            });
        if (status1 == status2) {
            const task1 = yield Task_entity_1.Task.createQueryBuilder('task')
                .where('task.id = :id1', { id1 })
                .getOne();
            const task2 = yield Task_entity_1.Task.createQueryBuilder('task')
                .where('task.id = :id2', { id2 })
                .getOne();
            if (!task1 || !task2)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Either status does not exist in the system 2',
                });
            if (task1.index > task2.index) {
                const allTask = yield Task_entity_1.Task.createQueryBuilder('task')
                    .where('task.index >= :index and task.statusId = :status', {
                    index: task2.index,
                    status: status1,
                })
                    .getMany();
                if (allTask)
                    yield Promise.all(allTask.map((task) => __awaiter(void 0, void 0, void 0, function* () {
                        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                            const result = Task_entity_1.Task.update({
                                id: Number(task.id),
                            }, {
                                index: Number(task.index) + 1,
                            });
                            resolve(result);
                        }));
                    })));
            }
            if (task1.index < task2.index) {
                const allTask = yield Task_entity_1.Task.createQueryBuilder('task')
                    .where('task.index > :index and task.index <= :index2 and task.statusId = :status', {
                    index: task1.index,
                    index2: task2.index,
                    status: status2,
                })
                    .getMany();
                if (allTask)
                    yield Promise.all(allTask.map((task) => __awaiter(void 0, void 0, void 0, function* () {
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
            const task1 = yield Task_entity_1.Task.createQueryBuilder('task')
                .where('task.id = :id1', { id1 })
                .getOne();
            const status2Exist = yield Status_entity_1.Status.findOne({
                where: {
                    id: status2,
                },
            });
            if (!task1 || !status2Exist)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Either status does not exist in the system 1',
                });
            if (!id2) {
                const lastTask = yield Task_entity_1.Task.findOne({
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
            const task2 = yield Task_entity_1.Task.createQueryBuilder('task')
                .where('task.id = :id2', { id2 })
                .getOne();
            const index = task2 === null || task2 === void 0 ? void 0 : task2.index;
            const allTask = yield Task_entity_1.Task.createQueryBuilder('task')
                .where('task.statusId = :status and task.index >= :index', {
                status: status2,
                index: task2 === null || task2 === void 0 ? void 0 : task2.index,
            })
                .getMany();
            if (allTask)
                yield Promise.all(allTask.map((task) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Get tasks by project
        const tasks = yield Task_entity_1.Task.find({
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
                    id: existingProject.id,
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
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        //Get tasks by employee
        const tasksAssigned = yield Task_entity_1.Task.find({
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
                    id: existingEmployee.id,
                },
            },
            relations: {
                time_logs: true,
                project: true,
                employees: true,
                status: true,
                milestone: true,
                assignBy: true,
            },
        });
        //Task was create by current user
        const tasksWasCreated = yield Task_entity_1.Task.find({
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
                    id: existingEmployee.id,
                },
            },
            relations: {
                time_logs: true,
                project: true,
                employees: true,
                status: true,
                milestone: true,
                assignBy: true,
            },
        });
        // merge arrays
        // using the concat() method
        // concat() method returns a new array
        const tasksMerge = tasksAssigned.concat(tasksWasCreated);
        // use for loop to remove duplicate items
        for (var i = 0; i < tasksMerge.length; ++i) {
            for (var j = i + 1; j < tasksMerge.length; ++j) {
                if (tasksMerge[i].id === tasksMerge[j].id)
                    tasksMerge.splice(j--, 1);
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            tasks: tasksMerge,
            message: 'Get tasks by employee successfully',
        });
    })),
    getByEmployeeAndProject: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId, projectId } = req.params;
        //Check exist employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        //Check exist project
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Get tasks by employee
        const tasksAssigned = yield Task_entity_1.Task.find({
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
                    id: existingEmployee.id,
                },
                project: {
                    id: existingProject.id,
                },
            },
            relations: {
                time_logs: true,
                project: true,
                employees: true,
                status: true,
                milestone: true,
                assignBy: true,
            },
        });
        //Task was created by current user
        const tasksWasCreated = yield Task_entity_1.Task.find({
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
                    id: existingEmployee.id,
                },
                project: {
                    id: existingProject.id,
                },
            },
            relations: {
                time_logs: true,
                project: true,
                employees: true,
                status: true,
                milestone: true,
                assignBy: true,
            },
        });
        // merge arrays
        // using the concat() method
        // concat() method returns a new array
        const tasksMerge = tasksAssigned.concat(tasksWasCreated);
        // use for loop to remove duplicate items
        for (var i = 0; i < tasksMerge.length; ++i) {
            for (var j = i + 1; j < tasksMerge.length; ++j) {
                if (tasksMerge[i].id === tasksMerge[j].id)
                    tasksMerge.splice(j--, 1);
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            tasks: tasksMerge,
            message: 'Get tasks by employee successfully',
        });
    })),
};
exports.default = taskController;
