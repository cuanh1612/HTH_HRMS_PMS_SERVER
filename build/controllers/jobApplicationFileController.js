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
const Job_Application_1 = require("../entities/Job_Application");
const Job_Application_File_1 = require("../entities/Job_Application_File");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const jobApplicationFileController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { jobApplication, files } = req.body;
        //check exist job application
        const existingJobApplication = yield Job_Application_1.Job_Application.findOne({
            where: {
                id: jobApplication,
            },
        });
        if (!existingJobApplication)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This job application does not exist in the system',
            });
        if (Array.isArray(files)) {
            files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                yield Job_Application_File_1.Job_application_file.create(Object.assign(Object.assign({}, file), { job_application: existingJobApplication })).save();
            }));
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new job application files success',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { jobApplicationFileId, jobApplicationId } = req.params;
        const existingJobApplication = yield Job_Application_1.Job_Application.findOne({
            where: {
                id: Number(jobApplicationId),
            },
        });
        if (!existingJobApplication)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This job application does not existing in the system',
            });
        //check existing job application file
        const existingJobApplicationFile = yield Job_Application_File_1.Job_application_file.findOne({
            where: {
                id: Number(jobApplicationFileId),
                job_application: {
                    id: Number(jobApplicationId),
                },
            },
        });
        if (!existingJobApplicationFile)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This job application file does not existing in the system',
            });
        //delete job application file
        yield existingJobApplicationFile.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete job application file success',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { jobApplicationId } = req.params;
        //Check exist job application
        const existingJobApplication = yield Job_Application_1.Job_Application.findOne({
            where: {
                id: Number(jobApplicationId),
            },
        });
        if (!existingJobApplication)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job application does not exist in the system',
            });
        //Get all job Application file
        const jobApplicationFiles = yield Job_Application_File_1.Job_application_file.find({
            where: {
                job_application: {
                    id: Number(jobApplicationId),
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            jobApplicationFiles,
            message: 'Get all job application files success successfully',
        });
    })),
};
exports.default = jobApplicationFileController;
