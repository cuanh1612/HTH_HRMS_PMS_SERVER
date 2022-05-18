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
const Project_Discussion_Category_1 = require("../entities/Project_Discussion_Category");
const Project_Discussion_Reply_1 = require("../entities/Project_Discussion_Reply");
const Project_Discussion_Room_1 = require("../entities/Project_Discussion_Room");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const project_discussion_payload_1 = require("../utils/valid/project_discussion_payload");
const projectDiscussionRoomController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const dataNewPdiscussionRoom = req.body;
        const { project, project_discussion_category, description } = dataNewPdiscussionRoom;
        const messageValid = project_discussion_payload_1.projectDiscussionRoomValid.createOrUpdate(dataNewPdiscussionRoom);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //check exists project
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: project
            }
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system'
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
        if (!existingProject.employees.some((employeeItem) => employeeItem.id === existingUser.id))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You not have authorization'
            });
        if (project_discussion_category) {
            //check exist project discussion category
            const existingpdCategory = yield Project_Discussion_Category_1.Project_discussion_category.findOne({
                where: {
                    id: project_discussion_category
                }
            });
            if (!existingpdCategory)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Project Discussion Category does not exist in the system'
                });
        }
        const createRoom = yield Project_Discussion_Room_1.Project_Discussion_Room.create(Object.assign({}, dataNewPdiscussionRoom)).save();
        //create first reply
        yield Project_Discussion_Reply_1.Project_discussion_reply.create({
            reply: description,
            project_discussion_room: createRoom,
            employee: existingUser
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionRoom: createRoom,
            message: 'Create new project discussion room success',
        });
    })),
    Delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { id } = req.params;
        const existingDiscussionroom = yield Project_Discussion_Room_1.Project_Discussion_Room.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingDiscussionroom)
            return res.status(400).json({
                code: 400,
                success: false,
                message: ' Project discussion room does not exist in the system'
            });
        //get project
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: existingDiscussionroom.project.id
            }
        });
        if (!existingProject) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system'
            });
        }
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
        if (!existingProject.employees.some((employeeItem) => employeeItem.id === existingUser.id))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You not have authorization'
            });
        yield existingDiscussionroom.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'delete project discussion room success'
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingDiscussionroom = yield Project_Discussion_Room_1.Project_Discussion_Room.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingDiscussionroom)
            return res.status(400).json({
                code: 400,
                success: false,
                message: ' Project discussion room does not exist in the system'
            });
        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionRoom: existingDiscussionroom,
            Message: 'Get detail project discussion room success'
        });
    })),
    getByProject: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { project_id } = req.params;
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: Number(project_id)
            }
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system'
            });
        const projectDiscussionRoom = yield Project_Discussion_Room_1.Project_Discussion_Room.find({
            where: {
                project: {
                    id: existingProject.id
                }
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionRoom,
            message: 'Get project discussion room by project success'
        });
    }))
};
exports.default = projectDiscussionRoomController;
