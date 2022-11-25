"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interview_controller_1 = __importDefault(require("../controllers/interview.controller"));
const interviewRouter = express_1.default.Router();
interviewRouter.post('/', interview_controller_1.default.create);
interviewRouter.delete('/:id', interview_controller_1.default.delete);
interviewRouter.post('/delete-many', interview_controller_1.default.deleteMany);
interviewRouter.get('/', interview_controller_1.default.getAll);
interviewRouter.get('/new', interview_controller_1.default.getNewByDate);
interviewRouter.get('/:id', interview_controller_1.default.getDetail);
interviewRouter.put('/status/:id', interview_controller_1.default.updateStatus);
interviewRouter.put('/:id', interview_controller_1.default.update);
interviewRouter.get('/job/:jobId', interview_controller_1.default.getByJob);
exports.default = interviewRouter;
