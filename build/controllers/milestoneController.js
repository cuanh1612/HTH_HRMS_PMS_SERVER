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
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const mileStoneController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, summary } = req.body;
        if (!title)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter title of milestone',
            });
        yield Milestone_1.Milestone.create({
            title: title,
            summary: summary
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create milestone success'
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { mileStoneId } = req.params;
        const dataUpdateMileStone = req.body;
        const existingMileStone = Milestone_1.Milestone.findOne({
            where: {
                id: Number(mileStoneId)
            }
        });
        if (!existingMileStone)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Milestone does not existing in the system',
            });
        yield Milestone_1.Milestone.update(dataUpdateMileStone.id, Object.assign({}, dataUpdateMileStone));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update milestone successfully',
        });
    })),
    getall: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const milestones = yield Milestone_1.Milestone.find();
        return res.status(200).json({
            code: 200,
            success: true,
            milestones: milestones,
            message: 'Get all milestone successfully',
        });
    })),
    getdetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { mileStoneId } = req.params;
        const existingMileStone = yield Milestone_1.Milestone.findOne({
            where: {
                id: Number(mileStoneId)
            }
        });
        if (!existingMileStone)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'MileStone does not existing in the system'
            });
        return res.status(200).json({
            code: 200,
            success: true,
            milestone: existingMileStone,
            message: 'Get detail of milestone success'
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { mileStoneId } = req.params;
        const existingMileStone = yield Milestone_1.Milestone.findOne({
            where: {
                id: Number(mileStoneId)
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
    deletemany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { milestones } = req.body;
        //check array of milestones
        console.log(milestones);
        if (!Array.isArray(milestones) || !milestones)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'milestone does not exist in the system',
            });
        for (let index = 0; index < milestones.length; index++) {
            const itemmilestone = milestones[index];
            const existingmilestone = yield Milestone_1.Milestone.findOne({
                where: {
                    id: Number(itemmilestone),
                },
            });
            if (existingmilestone) {
                yield existingmilestone.remove();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete milestones successfully',
        });
    })),
};
exports.default = mileStoneController;
