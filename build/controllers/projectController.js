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
const Client_1 = require("../entities/Client");
const Department_1 = require("../entities/Department");
const Employee_1 = require("../entities/Employee");
const Project_1 = require("../entities/Project");
const Project_Category_1 = require("../entities/Project_Category");
const Project_File_1 = require("../entities/Project_File");
const Task_1 = require("../entities/Task");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
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
        if (project_files) {
            //Create project files
            for (let index = 0; index < project_files.length; index++) {
                const project_file = project_files[index];
                yield Project_File_1.Project_file.create(Object.assign(Object.assign({}, project_file), { project: createdProject })).save();
            }
        }
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
        const projects = yield Project_1.Project.find();
        return res.status(200).json({
            code: 200,
            success: true,
            projects: projects,
            message: 'Get all projects success',
        });
    })),
    //Get detail project
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        //Calculate percentage of project progress from completed tasks
        const countTasks = yield Task_1.Task.createQueryBuilder('task')
            .where('task.projectId = :id', {
            id: existingproject.id,
        })
            .getCount();
        const countSuccessTasks = yield Task_1.Task.createQueryBuilder('task')
            .where('task.projectId = :id', {
            id: existingproject.id,
        })
            .andWhere('task.status = :status', {
            status: Task_1.enumStatus.COMPLETED,
        })
            .getCount();
        if (countSuccessTasks !== 0 && countTasks !== 0) {
            existingproject.Progress = (countSuccessTasks / countTasks) * 100;
            yield existingproject.save();
        }
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
};
exports.default = projectController;
