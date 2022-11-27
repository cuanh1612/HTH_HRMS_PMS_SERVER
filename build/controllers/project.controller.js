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
const Client_entity_1 = require("../entities/Client.entity");
const Department_entity_1 = require("../entities/Department.entity");
const Employee_entity_1 = require("../entities/Employee.entity");
const Hourly_rate_project_entity_1 = require("../entities/Hourly_rate_project.entity");
const Notification_entity_1 = require("../entities/Notification.entity");
const Project_entity_1 = require("../entities/Project.entity");
const Project_Category_entity_1 = require("../entities/Project_Category.entity");
const Project_File_entity_1 = require("../entities/Project_File.entity");
const Status_entity_1 = require("../entities/Status.entity");
const Task_entity_1 = require("../entities/Task.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const helper_1 = require("../utils/helper");
const projectValid_1 = require("../utils/valid/projectValid");
const projectController = {
    //Create new project
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewProject = req.body;
        const { project_category, department, client, employees, Added_by, project_files } = dataNewProject;
        let projectEmployees = [];
        //Check valid input create new project
        //Check valid
        const messageValid = projectValid_1.projectValid.createOrUpdate(dataNewProject, 'create');
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //check exist Added by
        if (Added_by) {
            const existingAddedBy = yield Employee_entity_1.Employee.findOne({
                where: {
                    id: Added_by,
                },
            });
            if (!existingAddedBy)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Admin add this project does not exist in the system',
                });
        }
        //check exist client
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: client,
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        //check exist department
        const existingDepartment = yield Department_entity_1.Department.findOne({
            where: {
                id: department,
            },
        });
        if (!existingDepartment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            });
        //check exist project categories
        const existingCategories = yield Project_Category_entity_1.Project_Category.findOne({
            where: {
                id: project_category,
            },
        });
        if (!existingCategories)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Category does not exist in the system',
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
                    projectEmployees.push(existingEmployee);
                resolve(true);
            }));
        })));
        //create project file
        const createdProject = yield Project_entity_1.Project.create(Object.assign(Object.assign({}, dataNewProject), { start_date: new Date(dataNewProject.start_date), deadline: new Date(dataNewProject.deadline), employees: projectEmployees })).save();
        yield Promise.all(projectEmployees.map((employee) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const hourlyRateExist = yield Hourly_rate_project_entity_1.Hourly_rate_project.findOne({
                    where: {
                        project: {
                            id: createdProject.id,
                        },
                        employee: {
                            id: employee.id,
                        },
                    },
                });
                if (hourlyRateExist)
                    return resolve(true);
                resolve(yield Hourly_rate_project_entity_1.Hourly_rate_project.insert({
                    project: {
                        id: createdProject.id,
                    },
                    employee: {
                        id: employee.id,
                    },
                    hourly_rate: employee.hourly_rate,
                }));
            }));
        })));
        if (project_files) {
            //Create project files
            for (let index = 0; index < project_files.length; index++) {
                const project_file = project_files[index];
                yield Project_File_entity_1.Project_file.create(Object.assign(Object.assign({}, project_file), { project: createdProject })).save();
            }
        }
        yield Status_entity_1.Status.create({
            title: 'Incomplete',
            root: true,
            project: createdProject,
            index: 0,
            color: '#ff0000',
        }).save();
        yield Status_entity_1.Status.create({
            title: 'Complete',
            root: true,
            project: createdProject,
            index: 1,
            color: '#00ff14',
        }).save();
        //Huy lam
        yield Promise.all(projectEmployees.map((employee) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //create notification
                yield Notification_entity_1.Notification.create({
                    employee,
                    url: '/projects',
                    content: 'You have just been assigned to a new project',
                }).save();
                resolve(true);
            }));
        })));
        //huy lam
        //create note for client
        yield Notification_entity_1.Notification.create({
            client: existingClient,
            url: '/projects',
            content: 'You have just been assigned to a new project',
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            project: createdProject,
            message: 'Create new Project successfully',
        });
    })),
    //Update Project
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateProject = req.body;
        const { Added_by, client, department, project_category } = dataUpdateProject;
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Check valid input create new project
        //Check valid
        const messageValid = projectValid_1.projectValid.createOrUpdate(dataUpdateProject, 'update');
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //check exist Added by
        const existingAddedBy = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Added_by,
            },
        });
        if (!existingAddedBy)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Admin add this project does not exist in the system',
            });
        //check exist client
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: client,
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        //check exist department
        const existingDepartment = yield Department_entity_1.Department.findOne({
            where: {
                id: department,
            },
        });
        if (!existingDepartment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            });
        //check exist project categories
        const existingCategories = yield Project_Category_entity_1.Project_Category.findOne({
            where: {
                id: project_category,
            },
        });
        if (!existingCategories)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Category does not exist in the system',
            });
        (existingProject.name = dataUpdateProject.name),
            (existingProject.project_category = existingCategories),
            (existingProject.department = existingDepartment),
            (existingProject.client = existingClient),
            (existingProject.Added_by = existingAddedBy),
            (existingProject.start_date = dataUpdateProject.start_date),
            (existingProject.deadline = dataUpdateProject.deadline),
            (existingProject.send_task_noti = true),
            (existingProject.project_summary = dataUpdateProject.project_summary),
            (existingProject.notes = dataUpdateProject.notes),
            (existingProject.project_status = dataUpdateProject.project_status),
            (existingProject.currency = dataUpdateProject.currency),
            (existingProject.project_budget = dataUpdateProject.project_budget),
            (existingProject.hours_estimate = dataUpdateProject.hours_estimate),
            yield existingProject.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update Project successfully',
        });
    })),
    // get all project (normal)
    getAllNormal: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const projects = yield Project_entity_1.Project.find({});
        return res.status(200).json({
            code: 200,
            success: true,
            projects,
            message: 'Get all projects success',
        });
    })),
    // get all project (normal) by employee
    getAllNormalByEmployee: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
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
        const projects = yield Project_entity_1.Project.find({
            where: {
                employees: {
                    id: existingEmployee.id,
                },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            projects,
            message: 'Get all projects success',
        });
    })),
    // get all project (normal) by client
    getAllNormalByClient: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clientId } = req.params;
        //Check existing client
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: Number(clientId),
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        const projects = yield Project_entity_1.Project.find({
            where: {
                client: {
                    id: existingClient.id,
                },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            projects,
            message: 'Get all projects success',
        });
    })),
    //Get all project with info of employees and client in project
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const projects = yield Project_entity_1.Project.find({
            relations: {
                employees: true,
                client: true,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            projects,
            message: 'Get all projects success',
        });
    })),
    //Get all project with info of employees and client in project
    getAllByCurrentUser: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        //check exist current user
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decode)
            return res.status(400).json({
                code: 401,
                success: false,
                message: 'Please login first',
            });
        //Create filter
        var filter = {};
        if (decode.role === 'Employee')
            filter.employees = {
                id: Number(decode.userId),
            };
        if (decode.role === 'Client')
            filter.client = {
                id: Number(decode.userId),
            };
        const projects = yield Project_entity_1.Project.find({
            relations: {
                employees: true,
                client: true,
            },
            where: filter,
        });
        return res.status(200).json({
            code: 200,
            success: true,
            projects,
            message: 'Get all projects success',
        });
    })),
    //Get employee not in the project
    getEmployeeNotIn: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId } = req.params;
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
            relations: {
                employees: true,
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 200,
                success: false,
                message: 'Project does not exist in the system',
            });
        const idEmployees = existingProject.employees.map((employee) => {
            return employee.id;
        });
        const allEmployees = yield Employee_entity_1.Employee.createQueryBuilder('employee')
            .where('employee.id NOT IN (:...ids)', {
            ids: idEmployees,
        })
            .getMany();
        return res.status(200).json({
            code: 200,
            success: true,
            employees: allEmployees,
            message: 'Get employee not in the project success',
        });
    })),
    //Assign Employee into project
    assignEmployee: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId } = req.params;
        const { employees } = req.body;
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
            relations: {
                employees: true,
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        const allEmployees = yield Employee_entity_1.Employee.createQueryBuilder('employee')
            .where('employee.id IN (:...ids)', {
            ids: employees,
        })
            .getMany();
        yield Promise.all(allEmployees.map((employee) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const hourlyRateExist = yield Hourly_rate_project_entity_1.Hourly_rate_project.findOne({
                    where: {
                        project: {
                            id: existingProject.id,
                        },
                        employee: {
                            id: employee.id,
                        },
                    },
                });
                if (hourlyRateExist)
                    return resolve(true);
                resolve(yield Hourly_rate_project_entity_1.Hourly_rate_project.insert({
                    project: {
                        id: existingProject.id,
                    },
                    employee: {
                        id: employee.id,
                    },
                    hourly_rate: employee.hourly_rate,
                }));
            }));
        })));
        existingProject.employees = [...existingProject.employees, ...allEmployees];
        yield existingProject.save();
        yield (0, helper_1.CreateProjectActivity)(res, existingProject.id, "Assigned new member successfully");
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Assign employee success',
        });
    })),
    //Assign Employee into project by department
    assignEmployeeByDepartment: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId } = req.params;
        const { departments } = req.body;
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
            relations: {
                employees: true,
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        const allEmployees = yield Employee_entity_1.Employee.createQueryBuilder('employee')
            .where('"departmentId" IN (:...ids)', {
            ids: departments,
        })
            .getMany();
        if (allEmployees.length == 0)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'There are no employees left to participate in the project',
            });
        yield Promise.all(allEmployees.map((employee) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                resolve(yield Hourly_rate_project_entity_1.Hourly_rate_project.insert({
                    project: {
                        id: existingProject.id,
                    },
                    employee: {
                        id: employee.id,
                    },
                    hourly_rate: employee.hourly_rate,
                }));
            }));
        })));
        existingProject.employees = [...existingProject.employees, ...allEmployees];
        yield existingProject.save();
        yield (0, helper_1.CreateProjectActivity)(res, existingProject.id, "Assigned new member successfully");
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Assign employee success',
        });
    })),
    //Get detail project
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingProject = yield Project_entity_1.Project.findOne({
            relations: {
                client: true,
                employees: true,
                project_Admin: true
            },
            where: {
                id: Number(id),
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Calculate percentage of project progress from completed tasks
        const countSuccessTasks = yield Task_entity_1.Task.createQueryBuilder('task')
            .leftJoinAndSelect('status', 'status', 'task.statusId = status.id')
            .where('task.projectId = :id', {
            id: existingProject.id,
        })
            .andWhere('status.title = :title', {
            title: 'Complete',
        })
            .getCount();
        const countTasks = yield Task_entity_1.Task.createQueryBuilder('task')
            .leftJoinAndSelect('status', 'status', 'task.statusId = status.id')
            .where('task.projectId = :id', {
            id: existingProject.id,
        })
            .getCount();
        if (countSuccessTasks !== 0 && countTasks !== 0) {
            existingProject.Progress = Math.round((countSuccessTasks / countTasks) * 100);
            yield existingProject.save();
        }
        return res.status(200).json({
            code: 200,
            success: true,
            project: existingProject,
            message: 'Get detail of project success',
        });
    })),
    //Delete project
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        yield existingProject.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete project success',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projects } = req.body;
        //check array of projects
        if (!Array.isArray(projects) || !projects)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        for (let index = 0; index < projects.length; index++) {
            const itemProject = projects[index];
            const existingProject = yield Project_entity_1.Project.findOne({
                where: {
                    id: itemProject.id,
                },
            });
            if (existingProject) {
                yield existingProject.remove();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete projects success',
        });
    })),
    //member huy
    checkAssigned: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { projectId } = req.params;
        //Check exist project
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
            relations: {
                client: true,
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
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
        const existingUser = (yield Employee_entity_1.Employee.findOne({
            where: {
                email: decode.email,
            },
        })) ||
            (yield Client_entity_1.Client.findOne({
                where: {
                    email: decode.email,
                },
            }));
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        if ((existingUser.role === Employee_entity_1.enumRole.EMPLOYEE &&
            existingProject.employees.some((employeeItem) => employeeItem.id === existingUser.id)) ||
            existingUser.role === Employee_entity_1.enumRole.ADMIN ||
            (existingUser.role === 'Client' && existingProject.client.email === existingUser.email)) {
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'You already signed this project',
            });
        }
        else {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You not assigned this project',
            });
        }
    })),
    setProjectAdmin: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { idProject, idEmployee } = req.body;
        if (!idProject || !idEmployee) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You need to enter full field',
            });
        }
        const project = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(idProject),
            },
        });
        const employee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(idEmployee),
            },
        });
        if (!project) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This project not exist',
            });
        }
        if (!employee) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This employee not exist',
            });
        }
        project.project_Admin = employee;
        yield project.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update role successfully',
        });
    })),
    allEmployees: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { idProject } = req.params;
        if (!idProject) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You need to enter full field',
            });
        }
        const project = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(idProject),
            },
            relations: {
                project_Admin: true,
                employees: true,
            },
        });
        if (!project) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This project not exist',
            });
        }
        const hourly_rate_projects = yield Promise.all(project.employees.map((employee) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                return resolve(yield Hourly_rate_project_entity_1.Hourly_rate_project.findOne({
                    where: {
                        project: {
                            id: project.id,
                        },
                        employee: {
                            id: employee.id,
                        },
                    },
                }));
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            project,
            message: 'get all Employees successfully',
            hourly_rate_projects,
        });
    })),
    deleteEmployee: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId, employeeId } = req.body;
        const manager = (0, typeorm_1.getManager)('huprom');
        if (!projectId || !employeeId) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter full field',
            });
        }
        const project = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
            relations: {
                project_Admin: true,
            },
        });
        if (project === null || project === void 0 ? void 0 : project.project_Admin) {
            if (project.project_Admin.id == Number(employeeId)) {
                yield manager.query(`update project set "projectAdminId" = null where project.id = ${project.id}`);
            }
        }
        const dataExist = yield manager.query(`select * from project_employee where "projectId" = ${Number(projectId)} and "employeeId" =  ${Number(employeeId)}`);
        if (!dataExist || dataExist.length == 0) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This employee is not involved in this project',
            });
        }
        yield manager.query(`DELETE FROM project_employee WHERE "projectId" = ${Number(projectId)} and "employeeId" = ${Number(employeeId)}`);
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete employee successfully',
        });
    })),
    countstatusTasks: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId } = req.params;
        //Check exist project
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
        });
        if (!existingProject) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This project does not exist in this project',
            });
        }
        const manager = (0, typeorm_1.getManager)('huprom');
        const countStatusTasks = yield manager.query(`SELECT status.title, status.color, COUNT(task.id) FROM status LEFT JOIN task on task."statusId" = status.id WHERE status."projectId" = ${projectId} GROUP BY (status.title, status.color)`);
        return res.status(200).json({
            code: 200,
            success: true,
            countstatusTasks: countStatusTasks,
            message: 'Get count status tasks successfully',
        });
    })),
    projectEarnings: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const { projectId } = req.params;
        //Check exist project
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
        });
        if (!existingProject) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This project does not exist in this project',
            });
        }
        const manager = (0, typeorm_1.getManager)('huprom');
        const projectEarnings = yield manager.query(`SELECT SUM(time_log.earnings) FROM time_log LEFT JOIN project on project.id = time_log."projectId" WHERE project.id = ${projectId} GROUP BY project.id`);
        return res.status(200).json({
            code: 200,
            success: true,
            projectEarnings: ((_c = projectEarnings[0]) === null || _c === void 0 ? void 0 : _c.sum) ? Number(projectEarnings[0].sum) : 0,
            message: 'Get project earnings successfully',
        });
    })),
    projectHoursLogged: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const { projectId } = req.params;
        //Check exist project
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
        });
        if (!existingProject) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This project does not exist in this project',
            });
        }
        const manager = (0, typeorm_1.getManager)('huprom');
        const projectHoursLogged = yield manager.query(`SELECT project.id, SUM(time_log.total_hours) FROM time_log LEFT JOIN project on project.id = time_log."projectId" WHERE project.id = ${projectId} GROUP BY project.id`);
        return res.status(200).json({
            code: 200,
            success: true,
            projectHoursLogged: ((_d = projectHoursLogged[0]) === null || _d === void 0 ? void 0 : _d.sum) ? Number(projectHoursLogged[0].sum) : 0,
            message: 'Get project hours logged successfully',
        });
    })),
    changeStatus: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId } = req.params;
        const { project_status } = req.body;
        if (!project_status ||
            project_status !== Project_entity_1.enumProjectStatus.CANCELED ||
            project_status !== Project_entity_1.enumProjectStatus.FINISHED ||
            project_status !== Project_entity_1.enumProjectStatus.IN_PROGRESS ||
            project_status !== Project_entity_1.enumProjectStatus.NOT_STARTED ||
            project_status !== Project_entity_1.enumProjectStatus.ON_HOLD)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Input not valid',
            });
        //Check exist project
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
        });
        if (!existingProject) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This project does not exist in this project',
            });
        }
        //Change status
        existingProject.project_status = project_status;
        yield existingProject.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Change project status successfully',
        });
    })),
    //Count project status by client
    projectStatusByClient: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clientId } = req.params;
        //Check existing client 
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: Number(clientId)
            }
        });
        if (!existingClient) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in this project',
            });
        }
        const manager = (0, typeorm_1.getManager)('huprom');
        const projectStatus = yield manager.query(`SELECT project.project_status, COUNT(project.id) from project WHERE project."clientId" = ${existingClient.id} GROUP BY project.project_status`);
        return res.status(200).json({
            code: 200,
            success: true,
            countProjectStatus: projectStatus,
            message: 'Get count project status by client successfully',
        });
    })),
};
exports.default = projectController;
