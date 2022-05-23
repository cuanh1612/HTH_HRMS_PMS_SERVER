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
const Milestone_1 = require("../entities/Milestone");
const Project_1 = require("../entities/Project");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const mileStoneController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, summary, project, cost } = req.body;
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: Number(project)
            }
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not existing',
            });
        if (!title)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter title of milestone',
            });
        yield Milestone_1.Milestone.create({
            title: title,
            summary: summary,
            project: project,
            cost: Number(cost)
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create milestone success'
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateMileStone = req.body;
        const existingMileStone = yield Milestone_1.Milestone.findOne({
            where: {
                id: Number(id)
            }
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
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not existing',
            });
        const existingMileStones = yield Milestone_1.Milestone.find({
            where: {
                project: {
                    id: Number(id)
                }
            },
            relations: {
                tasks: true
            }
        });
        if (!existingMileStones)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system'
            });
        return res.status(200).json({
            code: 200,
            success: true,
            milestones: existingMileStones,
            message: 'Get milestones by project success'
        });
    })),
    getByProject: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not existing',
            });
        const existingMileStones = yield Milestone_1.Milestone.find({
            where: {
                project: {
                    id: Number(id)
                }
            }
        });
        if (!existingMileStones)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system'
            });
        return res.status(200).json({
            code: 200,
            success: true,
            milestones: existingMileStones,
            message: 'Get milestones by project success'
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingMileStone = yield Milestone_1.Milestone.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingMileStone)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system'
            });
        yield existingMileStone.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete of milestone success'
        });
    })),
};
exports.default = mileStoneController;
