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
const Work_Experience_1 = require("../entities/Work_Experience");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const workExperienceController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter full field',
            });
        }
        const addResult = yield Work_Experience_1.Work_Experience.create({
            name: name
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create work experience type success',
            result: addResult,
        });
    })),
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const workExperiences = yield Work_Experience_1.Work_Experience.find();
        return res.status(200).json({
            code: 200,
            success: true,
            workExperiences,
            message: 'get all work_experience types success'
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateWorkExperience = req.body;
        const existingWorkExperience = yield Work_Experience_1.Work_Experience.findOne({
            where: {
                id: Number(id),
            }
        });
        if (!existingWorkExperience)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Work experience does not existing in the system',
            });
        (existingWorkExperience.name = dataUpdateWorkExperience.name),
            yield existingWorkExperience.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update work experience  success',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingWorkExperience = yield Work_Experience_1.Work_Experience.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingWorkExperience)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Work experience does not existing in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            workExperience: existingWorkExperience,
            message: 'Get detail of work experience success'
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingWorkExperience = yield Work_Experience_1.Work_Experience.findOne({
            where: {
                id: Number(id),
            }
        });
        if (!existingWorkExperience)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Work experience does not existing in the system',
            });
        yield existingWorkExperience.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete work experience type success',
        });
    })),
};
exports.default = workExperienceController;
