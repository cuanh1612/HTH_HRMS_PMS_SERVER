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
const Employee_1 = require("../entities/Employee");
const Project_1 = require("../entities/Project");
const Project_Discussion_Reply_1 = require("../entities/Project_Discussion_Reply");
const Project_Discussion_Room_1 = require("../entities/Project_Discussion_Room");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const projectDiscussionReplyController = {
    //create new discussion reply
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const dataNewDiscussionReply = req.body;
        const { project, project_discussion_room } = dataNewDiscussionReply;
        //check project discussion room 
        const existingProjectDiscussionRoom = yield Project_Discussion_Room_1.Project_Discussion_Room.findOne({
            where: {
                id: project_discussion_room
            }
        });
        if (!existingProjectDiscussionRoom)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project discussion room does not exist in the system'
            });
        //check project exists
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: project
            }
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //check exist current user
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system'
            });
        if (!existingProject.employees.some((employee) => employee.id === existingUser.id))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the discussion room'
            });
        const createdDiscussionReply = yield Project_Discussion_Reply_1.Project_discussion_reply.create(Object.assign({}, dataNewDiscussionReply)).save();
        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionReply: createdDiscussionReply,
        });
    })),
    getByProjectDiscussionRoom: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectDiscussionRoomId } = req.params;
        //check exist project discussion room
        const existingprojectDiscussionRoom = yield Project_Discussion_Room_1.Project_Discussion_Room.findOne({
            where: {
                id: Number(projectDiscussionRoomId),
            }
        });
        if (!existingprojectDiscussionRoom)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project discussion roome does not exist in the system'
            });
        const replies = yield Project_Discussion_Reply_1.Project_discussion_reply.find({
            where: {
                project_discussion_room: { id: existingprojectDiscussionRoom.id }
            },
            order: {
                createdAt: 'ASC',
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            replies,
            message: 'Get replies by project discussion success'
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { reply_id } = req.params;
        //check existing reply
        const existingReply = yield Project_Discussion_Reply_1.Project_discussion_reply.findOne({
            where: {
                id: Number(reply_id)
            }
        });
        if (!existingReply)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project discussion reply does not exist in the system'
            });
        //check exist current user
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system'
            });
        //check author reply
        if (existingUser.id === existingReply.employee.id) {
            yield existingReply.remove();
        }
        else {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You not authorization action this request'
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete discussion reply success'
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const { reply_id } = req.params;
        const { reply } = req.body;
        //check existing reply
        const existingReply = yield Project_Discussion_Reply_1.Project_discussion_reply.findOne({
            where: {
                id: Number(reply_id)
            }
        });
        if (!existingReply)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project discussion reply does not exist in the system'
            });
        //check exist current user
        const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system'
            });
        //check author reply
        if (existingUser.id === existingReply.employee.id) {
            existingReply.reply = reply;
            yield existingReply.save();
        }
        else {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You not authorization action this request'
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update reply success',
        });
    }))
};
exports.default = projectDiscussionReplyController;
