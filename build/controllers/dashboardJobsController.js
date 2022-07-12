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
const typeorm_1 = require("typeorm");
const Interview_1 = require("../entities/Interview");
const Job_1 = require("../entities/Job");
const Job_Application_1 = require("../entities/Job_Application");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const dashboardJobsController = {
    totalOpenings: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const total = yield Job_1.Job.createQueryBuilder('job')
            .where('job.status = :status', { status: true })
            .getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            totalOpenings: total,
            message: 'Get total openings successfully',
        });
    })),
    totalApplications: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const total = yield Job_Application_1.Job_Application.createQueryBuilder('job_application').getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            totalApplications: total,
            message: 'Get total applications successfully',
        });
    })),
    totalHired: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const total = yield Job_Application_1.Job_Application.createQueryBuilder('job_application')
            .where('job_application.status = :status', { status: 'Hired' })
            .getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            totalHired: total,
            message: 'Get total applications successfully',
        });
    })),
    totalRejected: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const total = yield Job_Application_1.Job_Application.createQueryBuilder('job_application')
            .where('job_application.status = :status', { status: 'Rejected' })
            .getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            totalRejected: total,
            message: 'Get total applications successfully',
        });
    })),
    todayInterview: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield Interview_1.Interview.find();
        const total = data.filter((interview) => {
            const interviewDate = new Date(interview.date);
            const dateFilter = new Date();
            return (interviewDate.getMonth() == dateFilter.getMonth() &&
                interviewDate.getFullYear() == dateFilter.getFullYear() &&
                interviewDate.getDate() == dateFilter.getDate());
        }).length;
        return res.status(200).json({
            code: 200,
            success: true,
            todayInterview: total,
            message: "Get total today's interviews successfully",
        });
    })),
    newInterview: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield Interview_1.Interview.find();
        const total = data.filter((interview) => {
            const date = new Date().getTime();
            const interviewDate = new Date(interview.date).getTime();
            return interviewDate >= date;
        }).length;
        return res.status(200).json({
            code: 200,
            success: true,
            newInterview: total,
            message: 'Get total applications successfully',
        });
    })),
    applicationStatus: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const manager = (0, typeorm_1.getManager)('huprom');
        const statusApplication = yield manager.query('SELECT COUNT(job_application.id), job_application.status FROM job_application GROUP BY job_application.status');
        return res.status(200).json({
            code: 200,
            success: true,
            applicationStatus: statusApplication,
            message: 'Get applications status successfully',
        });
    })),
    applicationSources: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const manager = (0, typeorm_1.getManager)('huprom');
        const sourcessApplication = yield manager.query('SELECT COUNT(job_application.id), job_application.source FROM job_application GROUP BY job_application.source');
        return res.status(200).json({
            code: 200,
            success: true,
            applicationSources: sourcessApplication,
            message: 'Get application sources successfully',
        });
    })),
    openJobs: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield Job_1.Job.find({
            where: {
                status: true,
            },
            relations: {
                recruiter: {
                    department: true
                }
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            openJobs: data,
            message: 'Get application sources successfully',
        });
    })),
    todayInterviewCalendar: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield Interview_1.Interview.find({
            relations: {
                candidate: true
            }
        });
        const result = data.filter((interview) => {
            const interviewDate = new Date(interview.date);
            const dateFilter = new Date();
            return (interviewDate.getMonth() == dateFilter.getMonth() &&
                interviewDate.getFullYear() == dateFilter.getFullYear() &&
                interviewDate.getDate() == dateFilter.getDate());
        });
        return res.status(200).json({
            code: 200,
            success: true,
            todayInterview: result,
            message: "Get today's interviews successfully",
        });
    })),
};
exports.default = dashboardJobsController;
