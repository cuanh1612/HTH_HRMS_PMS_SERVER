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
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const Project_1 = require("../entities/Project");
const Project_Activity_1 = require("../entities/Project_Activity");
const projectActivityController = {
    getByProject: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId } = req.params;
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: Number(projectId)
            }
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                status: false,
                message: 'Project does not existing in the system'
            });
        const projectActivity = yield Project_Activity_1.Project_Activity.find({
            where: {
                project: {
                    id: existingProject.id,
                }
            },
            order: {
                createdAt: 'DESC'
            }
        });
        return res.status(200).json({
            code: 200,
            status: true,
            projectActivity,
            message: 'get activities by project success'
        });
    }))
};
exports.default = projectActivityController;
