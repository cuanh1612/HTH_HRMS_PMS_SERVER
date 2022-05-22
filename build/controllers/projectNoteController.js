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
const Employee_1 = require("../entities/Employee");
const Project_1 = require("../entities/Project");
const Project_Note_1 = require("../entities/Project_Note");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const projectNoteValid_1 = require("../utils/valid/projectNoteValid");
const projectNoteController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewProjectNote = req.body;
        const { project, note_type, employees } = dataNewProjectNote;
        let listEmployeesAdd = [];
        //Check valid input
        const messageValid = projectNoteValid_1.projectNoteValid.createOrUpdate(dataNewProjectNote);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check exist project
        const exisitingProject = yield Project_1.Project.findOne({
            where: {
                id: project,
            },
        });
        if (!exisitingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Check type note private
        if (note_type === Project_Note_1.enumNoteType.PRIVATE) {
            if (Array.isArray(employees)) {
                yield Promise.all(employees.map((employee) => __awaiter(void 0, void 0, void 0, function* () {
                    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                        const existingEmployee = yield Employee_1.Employee.findOne({
                            where: {
                                id: employee,
                            },
                        });
                        if (existingEmployee) {
                            listEmployeesAdd.push(existingEmployee);
                        }
                        resolve(existingEmployee);
                    }));
                })));
            }
        }
        //Create new project note
        yield Project_Note_1.Project_note.create(Object.assign(Object.assign({}, dataNewProjectNote), { employees: listEmployeesAdd })).save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new Project files success successfully',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { projectNoteId } = req.params;
        const dataUpProjectNote = req.body;
        const { project, note_type, employees } = dataUpProjectNote;
        let listEmployeesUpdate = [];
        //Check valid input
        const messageValid = projectNoteValid_1.projectNoteValid.createOrUpdate(dataUpProjectNote);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check exist project note
        const existProjectNote = yield Project_Note_1.Project_note.findOne({
            where: {
                id: Number(projectNoteId),
                project: {
                    id: project,
                },
            },
        });
        if (!existProjectNote)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project note does not exist in the system',
            });
        //Check exist project
        const exisitingProject = yield Project_1.Project.findOne({
            where: {
                id: project,
            },
        });
        if (!exisitingProject)
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
        if (existingUser.role !== Employee_1.enumRole.ADMIN)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this feature',
            });
        //Check type note private
        if (note_type === Project_Note_1.enumNoteType.PRIVATE) {
            if (Array.isArray(employees)) {
                yield Promise.all(employees.map((employee) => __awaiter(void 0, void 0, void 0, function* () {
                    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                        const existingEmployee = yield Employee_1.Employee.findOne({
                            where: {
                                id: employee,
                            },
                        });
                        if (existingEmployee) {
                            listEmployeesUpdate.push(existingEmployee);
                        }
                        resolve(existingEmployee);
                    }));
                })));
            }
        }
        //Update project note
        existProjectNote.title = dataUpProjectNote.title;
        existProjectNote.detail = dataUpProjectNote.detail;
        existProjectNote.note_type = dataUpProjectNote.note_type;
        existProjectNote.visible_to_client = dataUpProjectNote.visible_to_client;
        existProjectNote.ask_re_password = dataUpProjectNote.ask_re_password;
        existProjectNote.employees = listEmployeesUpdate;
        yield existProjectNote.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new Project files success successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { projectNoteId } = req.params;
        //Check exist project note
        const existingProjectNote = yield Project_Note_1.Project_note.findOne({
            where: {
                id: Number(projectNoteId),
            },
        });
        if (!existingProjectNote)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project note does not exist in the system',
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
        if (existingUser.role !== Employee_1.enumRole.ADMIN)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this feature',
            });
        yield existingProjectNote.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete project note success successfully',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const { projectNotes } = req.body;
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
        if (existingUser.role !== Employee_1.enumRole.ADMIN)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this feature',
            });
        yield Promise.all(projectNotes.map((projectNoteId) => __awaiter(void 0, void 0, void 0, function* () {
            new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //Delete exist project note
                const existingProjectNote = yield Project_Note_1.Project_note.findOne({
                    where: {
                        id: Number(projectNoteId),
                    },
                });
                if (existingProjectNote) {
                    yield existingProjectNote.remove();
                }
                resolve(true);
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete many projects note success successfully',
        });
    })),
    getByProject: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const { projectId } = req.params;
        //Check exist project note
        const existingProject = yield Project_1.Project.findOne({
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
        //Get all project note public
        const projectNotesPublic = yield Project_Note_1.Project_note.find({
            where: {
                note_type: Project_Note_1.enumNoteType.PUBLIC,
                project: {
                    id: Number(projectId),
                },
            },
            select: {
                project: {
                    id: true,
                },
            },
            relations: {
                project: true,
            },
        });
        //Check if user is client will get private note for client
        if (existingUser.role === 'Client' && existingProject.client.id === existingUser.id) {
            //Get project note to client
            const projectNotesClient = yield Project_Note_1.Project_note.find({
                where: {
                    visible_to_client: true,
                    project: {
                        id: Number(projectId),
                    },
                },
                select: {
                    project: {
                        id: true,
                    },
                },
                relations: {
                    project: true,
                },
            });
            return res.status(200).json({
                code: 200,
                success: true,
                projectNotes: [...projectNotesPublic, ...projectNotesClient],
                message: 'Get project note by project success successfully',
            });
        }
        if (existingUser.role === Employee_1.enumRole.ADMIN) {
            const projectNotes = yield Project_Note_1.Project_note.find({
                where: {
                    project: {
                        id: Number(projectId),
                    },
                },
                select: {
                    project: {
                        id: true,
                    },
                },
                relations: {
                    project: true,
                },
            });
            return res.status(200).json({
                code: 200,
                success: true,
                projectNotes,
                message: 'Get project note by project success successfully',
            });
        }
        if (existingProject.employees.some((employeeItem) => employeeItem.id === existingUser.id)) {
            const projectNotesForClient = yield Project_Note_1.Project_note.find({
                where: {
                    project: {
                        id: Number(projectId),
                    },
                    employees: [{
                            id: existingUser.id
                        }]
                },
                select: {
                    project: {
                        id: true,
                    },
                },
                relations: {
                    project: true,
                },
            });
            return res.status(200).json({
                code: 200,
                success: true,
                projectNotes: [...projectNotesForClient, ...projectNotesPublic],
                message: 'Get project note by project success successfully',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            projectNotes: [],
            message: 'Get project note by project success successfully',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        const { projectNoteId } = req.params;
        //Check exist project note
        const existingProjectNote = yield Project_Note_1.Project_note.findOne({
            where: {
                id: Number(projectNoteId),
            },
            relations: {
                project: true,
            },
            select: {
                project: {
                    id: true,
                },
            },
        });
        if (!existingProjectNote)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project note does not exist in the system',
            });
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
        //Check if user is client will get private note for client
        if ((existingUser.role === 'Client' &&
            existingProjectNote.project.client.id === existingUser.id) ||
            existingUser.role === Employee_1.enumRole.ADMIN ||
            existingProjectNote.employees.some((employeeItem) => employeeItem.id === existingUser.id)) {
            return res.status(200).json({
                code: 200,
                success: true,
                projectNote: existingProjectNote,
                message: 'Get detail project note success successfully',
            });
        }
        else {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this feature',
            });
        }
    })),
};
exports.default = projectNoteController;
