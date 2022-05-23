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
const Client_1 = require("../entities/Client");
const Department_1 = require("../entities/Department");
const Employee_1 = require("../entities/Employee");
const Project_1 = require("../entities/Project");
const Project_Category_1 = require("../entities/Project_Category");
const Project_File_1 = require("../entities/Project_File");
const Status_1 = require("../entities/Status");
const Task_1 = require("../entities/Task");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const projectValid_1 = require("../utils/valid/projectValid");
const typeorm_1 = require("typeorm");
const Hourly_rate_project_1 = require("../entities/Hourly_rate_project");
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
            const existingAddedBy = yield Employee_1.Employee.findOne({
                where: {
                    id: Added_by,
                },
            });
            if (!existingAddedBy)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Addmin add this project does not exist in the system',
                });
        }
        //check exist client
        const existingClient = yield Client_1.Client.findOne({
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
        const existingDepartment = yield Department_1.Department.findOne({
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
        const existingCategories = yield Project_Category_1.Project_Category.findOne({
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
            projectEmployees.push(existingEmployee);
        }
        //create project file
        const createdProject = yield Project_1.Project.create(Object.assign(Object.assign({}, dataNewProject), { employees: projectEmployees })).save();
        yield Promise.all(projectEmployees.map((employee) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                resolve(yield Hourly_rate_project_1.Hourly_rate_project.insert({
                    project: {
                        id: createdProject.id
                    },
                    employee: {
                        id: employee.id
                    },
                    hourly_rate: employee.hourly_rate
                }));
            }));
        })));
        if (project_files) {
            //Create project files
            for (let index = 0; index < project_files.length; index++) {
                const project_file = project_files[index];
                yield Project_File_1.Project_file.create(Object.assign(Object.assign({}, project_file), { project: createdProject })).save();
            }
        }
        yield Status_1.Status.create({
            title: 'Incomplete',
            root: true,
            project: createdProject,
            index: 0,
            color: 'red',
        }).save();
        yield Status_1.Status.create({
            title: 'Complete',
            root: true,
            project: createdProject,
            index: 1,
            color: 'green',
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
        const existingproject = yield Project_1.Project.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingproject)
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
        const existingAddedBy = yield Employee_1.Employee.findOne({
            where: {
                id: Added_by,
            },
        });
        if (!existingAddedBy)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Addmin add this project does not exist in the system',
            });
        //check exist client
        const existingClient = yield Client_1.Client.findOne({
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
        const existingDepartment = yield Department_1.Department.findOne({
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
        const existingCategories = yield Project_Category_1.Project_Category.findOne({
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
        (existingproject.name = dataUpdateProject.name),
            (existingproject.project_category = existingCategories),
            (existingproject.department = existingDepartment),
            (existingproject.client = existingClient),
            (existingproject.Added_by = existingAddedBy),
            (existingproject.start_date = dataUpdateProject.start_date),
            (existingproject.deadline = dataUpdateProject.deadline),
            (existingproject.send_task_noti = true);
        yield existingproject.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update Project successfully',
        });
    })),
    //Get all project
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const projects = yield Project_1.Project.find({
            relations: {
                employees: true,
                client: true,
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            projects: projects,
            message: 'Get all projects success',
        });
    })),
    //Get employee not in the projet
    getEmployeeNotIn: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId } = req.params;
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: Number(projectId)
            },
            relations: {
                employees: true
            }
        });
        if (!existingProject)
            return res.status(400).json({
                code: 200,
                success: false,
                message: 'Project does not exist in the system'
            });
        const idEmployees = existingProject.employees.map(employee => {
            return employee.id;
        });
        const allEmployees = yield Employee_1.Employee.createQueryBuilder('employee').where('employee.id NOT IN (:...ids)', {
            ids: idEmployees
        }).getMany();
        return res.status(200).json({
            code: 200,
            success: true,
            employees: allEmployees,
            message: 'Get employee not in the project success'
        });
    })),
    //Assign Employee into project
    assignEmployee: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId } = req.params;
        const { employees } = req.body;
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: Number(projectId)
            },
            relations: {
                employees: true
            }
        });
        if (!existingProject)
            return res.status(400).json({
                code: 200,
                success: false,
                message: 'Project does not exist in the system'
            });
        const allEmployees = yield Employee_1.Employee.createQueryBuilder('employee').where('employee.id IN (:...ids)', {
            ids: employees
        }).getMany();
        existingProject.employees = [...existingProject.employees, ...allEmployees];
        yield existingProject.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Assign employee success'
        });
    })),
    //Get detail project
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingproject = yield Project_1.Project.findOne({
            relations: {
                client: true,
                employees: true,
            },
            where: {
                id: Number(id),
            },
        });
        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Calculate percentage of project progress from completed tasks
        const countSuccessTasks = yield Task_1.Task.createQueryBuilder('task')
            .leftJoinAndSelect('status', 'status', 'task.statusId = status.id')
            .where('task.projectId = :id', {
            id: existingproject.id,
        })
            .andWhere('status.title = :title', {
            title: 'Complete',
        })
            .getRawMany();
        console.log(countSuccessTasks);
        // if (countSuccessTasks !== 0 && countTasks !== 0) {
        // 	existingproject.Progress = (countSuccessTasks / countTasks) * 100
        // 	await existingproject.save()
        // }
        return res.status(200).json({
            code: 200,
            success: true,
            project: existingproject,
            message: 'Get detail of project success',
        });
    })),
    //Delete project
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingproject = yield Project_1.Project.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        yield existingproject.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete project success',
        });
    })),
    deletemany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const existingproject = yield Project_1.Project.findOne({
                where: {
                    id: itemProject.id,
                },
            });
            if (existingproject) {
                yield existingproject.remove();
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
        var _a;
        const { projectId } = req.params;
        //Check exist project
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
            relations: {
                client: true
            }
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
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
        const existingUser = (yield Employee_1.Employee.findOne({
            where: {
                email: decode.email,
            },
        })) ||
            (yield Client_1.Client.findOne({
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
        if ((existingUser.role === Employee_1.enumRole.EMPLOYEE &&
            existingProject.employees.some((employeeItem) => employeeItem.id === existingUser.id)) ||
            existingUser.role === Employee_1.enumRole.ADMIN ||
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
                message: 'You not asigned this project',
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
        const project = yield Project_1.Project.findOne({
            where: {
                id: Number(idProject)
            }
        });
        const employee = yield Employee_1.Employee.findOne({
            where: {
                id: Number(idEmployee)
            }
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
        const project = yield Project_1.Project.findOne({
            where: {
                id: Number(idProject),
            },
            relations: {
                project_Admin: true,
                employees: true,
            }
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
                return resolve(yield Hourly_rate_project_1.Hourly_rate_project.findOne({
                    where: {
                        project: {
                            id: project.id
                        },
                        employee: {
                            id: employee.id
                        }
                    }
                }));
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            project,
            message: 'get all Employees successfully',
            hourly_rate_projects
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
        const project = yield Project_1.Project.findOne({
            where: {
                id: Number(projectId)
            },
            relations: {
                project_Admin: true
            }
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
    }))
};
exports.default = projectController;
