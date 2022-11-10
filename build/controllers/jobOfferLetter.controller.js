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
const Job_entity_1 = require("../entities/Job.entity");
const Job_Application_entity_1 = require("../entities/Job_Application.entity");
const Job_Offer_Letter_entity_1 = require("../entities/Job_Offer_Letter.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const jobOfferLetterValid_1 = require("../utils/valid/jobOfferLetterValid");
const jobOfferLetterController = {
    //create new job offer letter
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewJobOfferLetter = req.body;
        const { job, job_application } = dataNewJobOfferLetter;
        const messageValid = jobOfferLetterValid_1.jobOfferLetterValid.createOrUpdate(dataNewJobOfferLetter);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                succesS: false,
                message: messageValid,
            });
        //check exist jobs
        const existingJobs = yield Job_entity_1.Job.findOne({
            where: {
                id: job,
            },
        });
        if (!existingJobs)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system',
            });
        //check exist job application
        const existingJobApplication = yield Job_Application_entity_1.Job_Application.findOne({
            where: {
                id: job_application,
            },
        });
        if (!existingJobApplication)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job application does not existing in the system',
            });
        const createJobOfferLetter = yield Job_Offer_Letter_entity_1.Job_offer_letter.create(Object.assign(Object.assign({}, dataNewJobOfferLetter), { expected_joining_date: new Date(dataNewJobOfferLetter.expected_joining_date), exprise_on: new Date(dataNewJobOfferLetter.exprise_on) })).save();
        const dateToken = new Date(dataNewJobOfferLetter.exprise_on).getTime() < new Date().getTime()
            ? '24h'
            : `${(new Date(dataNewJobOfferLetter.exprise_on).getTime() -
                new Date().getTime()) /
                (1000 * 60 * 60)}h`;
        const token = (0, jsonwebtoken_1.sign)({
            id: createJobOfferLetter.id,
        }, `${process.env.OFFER_TOKEN_SECRET}`, {
            expiresIn: dateToken,
        });
        createJobOfferLetter.token = `${token}`;
        yield createJobOfferLetter.save();
        return res.status(200).json({
            code: 200,
            success: true,
            jobOfferLetter: createJobOfferLetter,
            message: ' Create job application',
        });
    })),
    public: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = req.params;
        try {
            const { id } = (0, jsonwebtoken_1.verify)(token, `${process.env.OFFER_TOKEN_SECRET}`);
            const jobOfferLetter = yield Job_Offer_Letter_entity_1.Job_offer_letter.findOne({
                where: {
                    id: Number(id),
                },
                relations: {
                    job_application: true,
                    job: {
                        work_experience: true
                    },
                    sign: true,
                },
            });
            if (!jobOfferLetter)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Contract does not exists in the system',
                });
            return res.status(200).json({
                code: 200,
                success: true,
                jobOfferLetter,
                message: 'Created contract token successfully',
            });
        }
        catch (error) {
            return res.status(403).json({
                code: 403,
                success: false,
                message: 'You not allow to see',
            });
        }
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
        const existingOffer = yield Job_Offer_Letter_entity_1.Job_offer_letter.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingOffer) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: status,
            });
        }
        existingOffer.status = status;
        yield existingOffer.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Update job offer letter status successfully",
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateJobOfferLetter = req.body;
        const { job, job_application } = dataUpdateJobOfferLetter;
        //check exist job offer letter
        const existingJobOfferLetter = yield Job_Offer_Letter_entity_1.Job_offer_letter.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingJobOfferLetter)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job offer letter does not exist in the system',
            });
        //check exist job application
        const existingJobApplication = yield Job_Application_entity_1.Job_Application.findOne({
            where: {
                id: Number(job_application),
            },
        });
        if (!existingJobApplication)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job Application does not exist in the system',
            });
        //check exist job
        const existingJob = yield Job_entity_1.Job.findOne({
            where: {
                id: job,
            },
        });
        if (!existingJob)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not exisitng in the system',
            });
        (existingJobOfferLetter.job = dataUpdateJobOfferLetter.job),
            (existingJobOfferLetter.job_application = dataUpdateJobOfferLetter.job_application),
            (existingJobOfferLetter.expected_joining_date = new Date(dataUpdateJobOfferLetter.expected_joining_date)),
            (existingJobOfferLetter.exprise_on = new Date(dataUpdateJobOfferLetter.exprise_on)),
            (existingJobOfferLetter.salary = dataUpdateJobOfferLetter.salary),
            (existingJobOfferLetter.rate = dataUpdateJobOfferLetter.rate);
        if (dataUpdateJobOfferLetter.status) {
            existingJobOfferLetter.status = dataUpdateJobOfferLetter.status;
        }
        yield existingJobOfferLetter.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update job offer letter success',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingJobOfferLetter = yield Job_Offer_Letter_entity_1.Job_offer_letter.findOne({
            where: {
                id: Number(id),
            },
            relations: {
                job: {
                    work_experience: true,
                },
                job_application: true,
            },
        });
        if (!existingJobOfferLetter)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This job offer letter does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            jobOfferLetter: existingJobOfferLetter,
            message: 'Get detail of job offer letter success',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const jobOfferLetters = yield Job_Offer_Letter_entity_1.Job_offer_letter.find({
            relations: {
                job_application: true,
                job: true,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            jobOfferLetters,
            message: 'Get all job offer letters success',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingJobOfferLetter = yield Job_Offer_Letter_entity_1.Job_offer_letter.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingJobOfferLetter)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This job offer letter does not exist in the system',
            });
        //Delete job offer letter
        yield existingJobOfferLetter.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'delete job offer letter success',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { jobOfferLetters } = req.body;
        //check array of job offer letters
        if (!Array.isArray(jobOfferLetters))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select job offer letter to delete many',
            });
        yield Promise.all(jobOfferLetters.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingJobOfferLetter = yield Job_Offer_Letter_entity_1.Job_offer_letter.findOne({
                    where: {
                        id,
                    },
                });
                if (existingJobOfferLetter) {
                    //Delete job offer letter
                    yield Job_Offer_Letter_entity_1.Job_offer_letter.remove(existingJobOfferLetter);
                }
                resolve(true);
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete job offer letters success',
        });
    })),
    getByJob: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { JobId } = req.params;
        const existingJob = yield Job_entity_1.Job.findOne({
            where: {
                id: Number(JobId),
            },
        });
        if (!existingJob)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system',
            });
        const jobOfferLettersByJob = yield Job_Offer_Letter_entity_1.Job_offer_letter.find({
            where: {
                job: {
                    id: Number(JobId),
                },
            },
            relations: {
                job_application: true,
                job: true,
            },
        });
        if (!jobOfferLettersByJob)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job offer letters does not existing in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            jobOfferLetters: jobOfferLettersByJob,
            message: 'Get job offer letters by job success',
        });
    })),
};
exports.default = jobOfferLetterController;
