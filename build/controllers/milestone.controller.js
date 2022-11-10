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
const Client_entity_1 = require("../entities/Client.entity");
const Employee_entity_1 = require("../entities/Employee.entity");
const Milestone_entity_1 = require("../entities/Milestone.entity");
const Project_entity_1 = require("../entities/Project.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const helper_1 = require("../utils/helper");
const mileStoneController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { title, summary, project, cost } = req.body;
        //Check exist project
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
        if (existingUser.role !== Employee_entity_1.enumRole.ADMIN &&
            existingUser.email !== existingProject.project_Admin.email)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this feature',
            });
        //Create project
        if (!title)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter title of milestone',
            });
        yield Milestone_entity_1.Milestone.create({
            title: title,
            summary: summary,
            project: project,
            cost: Number(cost),
        }).save();
        //Crete activity for project
        yield (0, helper_1.CreateProjectActivity)(res, existingProject.id, 'New milestone status Added To The Project');
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create milestone success',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const milestones = yield Milestone_entity_1.Milestone.find({});
        return res.status(200).json({
            code: 200,
            success: true,
            milestones,
            message: 'Get milestones by project success',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateMileStone = req.body;
        const existingMileStone = yield Milestone_entity_1.Milestone.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingMileStone)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Milestone does not existing in the system',
            });
        existingMileStone.title = dataUpdateMileStone.title;
        existingMileStone.summary = dataUpdateMileStone.summary;
        existingMileStone.cost = dataUpdateMileStone.cost;
        existingMileStone.addtobudget = dataUpdateMileStone.addtobudget;
        existingMileStone.status = dataUpdateMileStone.status;
        yield existingMileStone.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update milestone successfully',
        });
    })),
    getByProjectWithTask: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                message: 'Project does not existing',
            });
        const existingMileStones = yield Milestone_entity_1.Milestone.find({
            where: {
                project: {
                    id: Number(id),
                },
            },
            relations: {
                tasks: true,
            },
        });
        if (!existingMileStones)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            milestones: existingMileStones,
            message: 'Get milestones by project success',
        });
    })),
    getByProject: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                message: 'Project does not existing',
            });
        const existingMileStones = yield Milestone_entity_1.Milestone.find({
            where: {
                project: {
                    id: Number(id),
                },
            },
        });
        if (!existingMileStones)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            milestones: existingMileStones,
            message: 'Get milestones by project success',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingMileStone = yield Milestone_entity_1.Milestone.findOne({
            where: {
                id: Number(id),
            },
            relations: {
                tasks: {
                    employees: true,
                    status: true,
                    assignBy: true,
                },
            },
        });
        if (!existingMileStone)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            milestone: existingMileStone,
            message: 'Get milestones by project success',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { id } = req.params;
        const existingMileStone = yield Milestone_entity_1.Milestone.findOne({
            where: {
                id: Number(id),
            },
            relations: {
                project: true,
            },
            select: {
                id: true,
            },
        });
        if (!existingMileStone)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system',
            });
        //Check exist project
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: existingMileStone.project.id,
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
        if (existingUser.role !== Employee_entity_1.enumRole.ADMIN &&
            existingUser.email !== existingProject.project_Admin.email)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this feature',
            });
        //Delete milestone
        yield existingMileStone.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete of milestone success',
        });
    })),
};
exports.default = mileStoneController;
