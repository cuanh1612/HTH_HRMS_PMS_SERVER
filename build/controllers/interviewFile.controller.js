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
const Interview_entity_1 = require("../entities/Interview.entity");
const Interview_File_entity_1 = require("../entities/Interview_File.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const interviewFileController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { interview, files } = req.body;
        //check exist interview
        const existingInterview = yield Interview_entity_1.Interview.findOne({
            where: {
                id: interview,
            }
        });
        if (!existingInterview)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This interview does not exist in the system',
            });
        if (Array.isArray(files)) {
            files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                yield Interview_File_entity_1.Interview_file.create(Object.assign(Object.assign({}, file), { interview: existingInterview })).save();
            }));
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new interview files success'
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { interviewFileId, InterviewId } = req.params;
        const existingInterview = yield Interview_entity_1.Interview.findOne({
            where: {
                id: Number(InterviewId),
            },
        });
        if (!existingInterview)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This interview does not existing in the system'
            });
        //check existing interview file
        const existingInterviewFile = yield Interview_File_entity_1.Interview_file.findOne({
            where: {
                id: Number(interviewFileId),
                interview: {
                    id: Number(InterviewId),
                }
            }
        });
        if (!existingInterviewFile)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This interview file does not existing in the system'
            });
        //delete interview file 
        yield existingInterviewFile.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete interview file success'
        });
    })),
    getAll: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { interviewId } = req.params;
        //Check exist interview
        const existingInterview = yield Interview_entity_1.Interview.findOne({
            where: {
                id: Number(interviewId),
            },
        });
        if (!existingInterview)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Interview does not exist in the system',
            });
        //Get all interview file 
        const interviewFiles = yield Interview_File_entity_1.Interview_file.find({
            where: {
                interview: {
                    id: Number(interviewId)
                }
            },
            order: {
                createdAt: "DESC"
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            interviewFiles,
            message: 'Get all interview files success successfully',
        });
    })),
};
exports.default = interviewFileController;
