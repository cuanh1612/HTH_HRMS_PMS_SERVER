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
const Job_Type_entity_1 = require("../entities/Job_Type.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const jobTypeController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter full field',
            });
        }
        const add_result = yield Job_Type_entity_1.Job_Type.create({
            name: name,
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create job type success',
            result: add_result,
        });
    })),
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const jobTypes = yield Job_Type_entity_1.Job_Type.find();
        return res.status(200).json({
            code: 200,
            success: true,
            jobTypes,
            message: 'get all job types success',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateJobType = req.body;
        const existingJobType = yield Job_Type_entity_1.Job_Type.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingJobType)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'job type does not existing in the system',
            });
        (existingJobType.name = dataUpdateJobType.name), yield existingJobType.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update job type success',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingJobType = yield Job_Type_entity_1.Job_Type.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingJobType)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job type does not existing in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            jobType: existingJobType,
            message: 'Get detail of job type success',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingJobType = yield Job_Type_entity_1.Job_Type.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingJobType)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job type does not existing in the system',
            });
        yield existingJobType.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete job type success',
        });
    })),
};
exports.default = jobTypeController;
