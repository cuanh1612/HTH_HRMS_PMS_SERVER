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
const Holiday_1 = require("../entities/Holiday");
const Project_1 = require("../entities/Project");
const Project_Category_1 = require("../entities/Project_Category");
const Project_File_1 = require("../entities/Project_File");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const projectValid_1 = require("../utils/valid/projectValid");
const projectController = {
    //Create new project
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewProject = req.body;
        const { name, project_category, department, client, employees, Added_by, project_files } = dataNewProject;
        let projectEmployees = [];
        let projectFiles = [];
        //Check valid input create new project
        //Check valid
        const messageValid = projectValid_1.projectValid.createOrUpdate(dataNewProject);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //check existing name of project
        const existingName = yield Project_1.Project.findOne({
            where: {
                name: String(name)
            }
        });
        if (existingName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Name of project already exist in the system',
            });
        //check exist Added by
        if (Added_by) {
            const existingAddedBy = yield Employee_1.Employee.findOne({
                where: {
                    id: Added_by
                }
            });
            if (!existingAddedBy)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Addmin add this project does not exist in the system'
                });
        }
        //check exist client
        const existingClient = yield Client_1.Client.findOne({
            where: {
                id: client
            }
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
                id: department
            }
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
                id: project_category
            }
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
                    id: employee_id
                }
            });
            if (!existingEmployee)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Employees does not exist in the system'
                });
            projectEmployees.push(existingEmployee);
        }
        //Create project files
        for (let index = 0; index < project_files.length; index++) {
            const project_file = project_files[index];
            const createProjectFile = yield Project_File_1.Project_file.create(Object.assign({}, project_file)).save();
            projectFiles.push(createProjectFile);
        }
        const createdProject = yield Project_1.Project.create(Object.assign(Object.assign({}, dataNewProject), { employees: projectEmployees, project_files: projectFiles })).save();
        return res.status(200).json({
            code: 200,
            success: true,
            project: createdProject,
            message: 'Create new Project successfully'
        });
    })),
    //Update Project
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateProject = req.body;
        const { Added_by, client, department, project_category, employees, } = dataUpdateProject;
        let projectEmployees = [];
        const existingproject = yield Holiday_1.Holiday.findOne({
            where: {
                id: Number(id),
            }
        });
        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system'
            });
        //Check valid input create new project
        //Check valid
        const messageValid = projectValid_1.projectValid.createOrUpdate(dataUpdateProject);
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
                    id: Added_by
                }
            });
            if (!existingAddedBy)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Addmin add this project does not exist in the system'
                });
        }
        //check exist client
        const existingClient = yield Client_1.Client.findOne({
            where: {
                id: client
            }
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
                id: department
            }
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
                id: project_category
            }
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
                    id: employee_id
                }
            });
            if (!existingEmployee)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Employees does not exist in the system'
                });
            projectEmployees.push(existingEmployee);
        }
        yield Project_1.Project.update(existingproject.id, Object.assign(Object.assign({}, dataUpdateProject), { employees: projectEmployees }));
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
            }
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
                }
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
    }))
};
exports.default = projectController;
