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
const Employee_1 = require("../entities/Employee");
const Interview_1 = require("../entities/Interview");
const Job_1 = require("../entities/Job");
const Job_Application_1 = require("../entities/Job_Application");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const interviewController = {
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const interviews = yield Interview_1.Interview.find({});
        return res.status(200).json({
            code: 200,
            success: true,
            interviews,
            message: 'Get all Events successfully',
        });
    })),
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { candidate, date, comment, interviewer, type, start_time, } = req.body;
        const listValidInterviewer = [];
        if (!candidate || !interviewer || !date || !start_time) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter fullfield',
            });
        }
        if (!Array.isArray(interviewer) || interviewer.length === 0) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select interviewer',
            });
        }
        const existCandidate = yield Job_Application_1.Job_Application.findOne({
            where: {
                id: candidate,
            },
        });
        if (!existCandidate) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Candidate not exist in system',
            });
        }
        if (!existCandidate) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Candidate not exist in system',
            });
        }
        //Check exisit interviewer
        yield Promise.all(interviewer.map((interviewId) => {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingInterviewer = yield Employee_1.Employee.findOne({
                    where: {
                        id: interviewId,
                    },
                });
                if (!existingInterviewer) {
                    return res.status(400).json({
                        code: 400,
                        success: false,
                        message: 'Please select valid interviewer',
                    });
                }
                listValidInterviewer.push(existingInterviewer);
                return resolve(true);
            }));
        }));
        yield Interview_1.Interview.create({
            date: new Date(date),
            comment,
            start_time,
            interviewer: listValidInterviewer,
            candidate: existCandidate,
            type,
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create interview successfully',
        });
    })),
    updateStatus: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { status } = req.body;
        if (!id) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter full field',
            });
        }
        const existingInterview = yield Interview_1.Interview.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingInterview) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This interview not exist in system',
            });
        }
        existingInterview.status = status;
        yield existingInterview.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update status successfully',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = req.body;
        const { interviewer } = data;
        const { id } = req.params;
        const listValidInterviewer = [];
        const existInterview = yield Interview_1.Interview.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existInterview) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Interview not exist in system',
            });
        }
        if (data.candidate) {
            const existCandidate = yield Job_Application_1.Job_Application.findOne({
                where: {
                    id: data.candidate,
                },
            });
            if (existCandidate) {
                existInterview.candidate = existCandidate;
            }
        }
        //Check exisit interviewer
        yield Promise.all(interviewer.map((interviewId) => {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingInterviewer = yield Employee_1.Employee.findOne({
                    where: {
                        id: interviewId,
                    },
                });
                if (!existingInterviewer) {
                    return res.status(400).json({
                        code: 400,
                        success: false,
                        message: 'Please select valid interviewer',
                    });
                }
                listValidInterviewer.push(existingInterviewer);
                return resolve(true);
            }));
        }));
        existInterview.interviewer = listValidInterviewer;
        if (data.start_time)
            existInterview.start_time = data.start_time;
        if (data.comment)
            existInterview.comment = data.comment;
        if (data.date)
            existInterview.date = new Date(data.date);
        if (data.type)
            existInterview.type = data.type;
        if (data.status)
            existInterview.status = data.status;
        yield existInterview.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update interview successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existInterview = yield Interview_1.Interview.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existInterview) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Interview not exist in system',
            });
        }
        yield existInterview.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete interview successfully',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingInterview = yield Interview_1.Interview.findOne({
            where: {
                id: Number(id),
            },
            relations: {
                candidate: {
                    jobs: true
                },
                interviewer: true
            }
        });
        if (!existingInterview)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Interview does not existing in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            interview: existingInterview,
            message: 'Get detail of job success',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { interviews } = req.body;
        //check array of job
        if (!Array.isArray(interviews))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Interviews does not existing in the system',
            });
        const handleDl = (id) => __awaiter(void 0, void 0, void 0, function* () {
            const existingInterview = yield Interview_1.Interview.findOne({
                where: {
                    id: id,
                },
            });
            if (existingInterview)
                yield existingInterview.remove();
        });
        yield Promise.all(interviews.map((id) => {
            return new Promise((resolve) => {
                handleDl(id);
                resolve(true);
            });
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete jobs success',
        });
    })),
    getByJob: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { jobId } = req.params;
        //Check exist job
        const existingJob = yield Job_1.Job.findOne({
            where: {
                id: Number(jobId)
            }
        });
        if (!existingJob)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system',
            });
        //Get interivews by job 
        const interviews = yield Interview_1.Interview.find({
            where: {
                candidate: {
                    jobs: {
                        id: existingJob.id
                    }
                }
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            interviews,
            message: 'Get interviews by job successfully',
        });
    })),
};
exports.default = interviewController;
