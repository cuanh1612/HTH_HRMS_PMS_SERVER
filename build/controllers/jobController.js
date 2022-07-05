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
const Department_1 = require("../entities/Department");
const Employee_1 = require("../entities/Employee");
const Job_1 = require("../entities/Job");
const Job_Type_1 = require("../entities/Job_Type");
const Location_1 = require("../entities/Location");
const Skill_1 = require("../entities/Skill");
const Work_Experience_1 = require("../entities/Work_Experience");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const jobValid_1 = require("../utils/valid/jobValid");
const jobControler = {
    //create new job
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewJob = req.body;
        const { department, recruiter, locations, job_type, work_experience, skills } = dataNewJob;
        const listValidSkills = [];
        const listValidLocations = [];
        const messageValid = jobValid_1.jobValid.createOrUpdate(dataNewJob);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //check exist department
        const existingDepartment = yield Department_1.Department.findOne({
            where: {
                id: department,
            },
        });
        if (!existingDepartment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            });
        //check existing recruiter
        if (recruiter) {
            const exisitingRecruiter = yield Employee_1.Employee.findOne({
                where: {
                    id: recruiter,
                },
            });
            if (!exisitingRecruiter)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Recruiter does not exist in the system',
                });
        }
        //Check skill
        yield Promise.all(skills.map((skillId) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //Check exist skill
                const existingSkill = yield Skill_1.Skill.findOne({
                    where: {
                        id: skillId,
                    },
                });
                if (!existingSkill)
                    return res.status(400).json({
                        code: 400,
                        success: false,
                        message: 'Skill does not exist in the system',
                    });
                listValidSkills.push(existingSkill);
                return resolve(true);
            }));
        })));
        //Check locations
        yield Promise.all(locations.map((locationId) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //Check exist location
                const existingLocation = yield Location_1.Location.findOne({
                    where: {
                        id: locationId,
                    },
                });
                if (!existingLocation)
                    return res.status(400).json({
                        code: 400,
                        success: false,
                        message: 'Location does not exist in the system',
                    });
                listValidLocations.push(existingLocation);
                return resolve(true);
            }));
        })));
        //check job type
        const existingJobType = yield Job_Type_1.Job_Type.findOne({
            where: {
                id: job_type,
            },
        });
        if (!existingJobType)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job type does not exist in the system',
            });
        //check work experience
        const existingWorkExperience = yield Work_Experience_1.Work_Experience.findOne({
            where: {
                id: work_experience,
            },
        });
        if (!existingWorkExperience)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Work Experience does not exist in the system',
            });
        const endDate = new Date(dataNewJob.ends_on_date);
        const startDate = new Date(dataNewJob.starts_on_date);
        const createJob = yield Job_1.Job.create(Object.assign(Object.assign({}, dataNewJob), { ends_on_date: endDate, starts_on_date: startDate, skills: listValidSkills, locations: listValidLocations })).save();
        return res.status(200).json({
            code: 200,
            success: true,
            job: createJob,
            message: ' Create job',
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
        const existingJob = yield Job_1.Job.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingJob) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This job not exist in system',
            });
        }
        existingJob.status = status ? true : false;
        yield existingJob.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Update job's status successfully ",
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const datatUpdateJob = req.body;
        const { department, recruiter, locations, job_type, work_experience, skills } = datatUpdateJob;
        const listValidSkills = [];
        const listValidLocations = [];
        const messageValid = jobValid_1.jobValid.createOrUpdate(datatUpdateJob);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //check exist job
        const existingJob = yield Job_1.Job.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingJob)
            return res.status(400).json({
                code: 400,
                success: false.valueOf,
                message: 'Job does not exist in the system',
            });
        //check exist department
        const existingDepartment = yield Department_1.Department.findOne({
            where: {
                id: department,
            },
        });
        if (!existingDepartment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            });
        //check existing recruiter
        if (recruiter) {
            const exisitingRecruiter = yield Employee_1.Employee.findOne({
                where: {
                    id: recruiter,
                },
            });
            if (!exisitingRecruiter)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Recruiter does not exist in the system',
                });
        }
        //Check skill
        yield Promise.all(skills.map((skillId) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //Check exist skill
                const existingSkill = yield Skill_1.Skill.findOne({
                    where: {
                        id: skillId,
                    },
                });
                if (!existingSkill)
                    return res.status(400).json({
                        code: 400,
                        success: false,
                        message: 'Skill does not exist in the system',
                    });
                listValidSkills.push(existingSkill);
                return resolve(true);
            }));
        })));
        //Check locations
        yield Promise.all(locations.map((locationId) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //Check exist location
                const existingLocation = yield Location_1.Location.findOne({
                    where: {
                        id: locationId,
                    },
                });
                if (!existingLocation)
                    return res.status(400).json({
                        code: 400,
                        success: false,
                        message: 'Location does not exist in the system',
                    });
                listValidLocations.push(existingLocation);
                return resolve(true);
            }));
        })));
        //check job type
        const existingJobType = yield Job_Type_1.Job_Type.findOne({
            where: {
                id: job_type,
            },
        });
        if (!existingJobType)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job type does not exist in the system',
            });
        //check work experience
        const existingWorkExperience = yield Work_Experience_1.Work_Experience.findOne({
            where: {
                id: work_experience,
            },
        });
        if (!existingWorkExperience)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Work Experience does not exist in the system',
            });
        //update job
        existingJob.title = datatUpdateJob.title;
        if (datatUpdateJob.starts_on_date) {
            existingJob.starts_on_date = new Date(datatUpdateJob.starts_on_date);
        }
        if (datatUpdateJob.ends_on_date) {
            existingJob.ends_on_date = new Date(datatUpdateJob.ends_on_date);
        }
        existingJob.skills = listValidSkills;
        existingJob.locations = listValidLocations;
        existingJob.department = datatUpdateJob.department;
        existingJob.status = datatUpdateJob.status;
        existingJob.total_openings = datatUpdateJob.total_openings;
        existingJob.job_type = datatUpdateJob.job_type;
        existingJob.work_experience = datatUpdateJob.work_experience;
        existingJob.recruiter = datatUpdateJob.recruiter;
        existingJob.starting_salary_amount = datatUpdateJob.starting_salary_amount;
        existingJob.job_description = datatUpdateJob.job_description;
        if (datatUpdateJob.rate) {
            existingJob.rate = datatUpdateJob.rate;
        }
        yield existingJob.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update Job success',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const jobs = yield Job_1.Job.find();
        return res.status(200).json({
            code: 200,
            success: true,
            jobs,
            message: 'Get all jobs success',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingJob = yield Job_1.Job.findOne({
            where: {
                id: Number(id),
            },
            relations: {
                department: true,
                job_type: true,
                recruiter: true,
                work_experience: true,
                skills: true,
                locations: true,
            },
        });
        if (!existingJob)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            job: existingJob,
            message: 'Get detail of job success',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingJob = yield Job_1.Job.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingJob)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system',
            });
        yield existingJob.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete this job success',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { jobs } = req.body;
        //check array of job
        if (!Array.isArray(jobs) || !jobs)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system',
            });
        yield Promise.all(jobs.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingJob = yield Job_1.Job.findOne({
                    where: {
                        id: id,
                    },
                });
                if (existingJob)
                    yield Job_1.Job.remove(existingJob);
                resolve(true);
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete jobs success',
        });
    })),
    changeStatusMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { jobs } = req.body;
        const { status } = req.body;
        //check array of job
        if (!Array.isArray(jobs) || !jobs)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system',
            });
        yield Promise.all(jobs.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingJob = yield Job_1.Job.findOne({
                    where: {
                        id: id,
                    },
                });
                if (existingJob) {
                    existingJob.status = status;
                }
                yield (existingJob === null || existingJob === void 0 ? void 0 : existingJob.save());
                resolve(true);
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'change status jobs success',
        });
    })),
};
exports.default = jobControler;
