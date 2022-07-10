"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interviewFileController_1 = __importDefault(require("../controllers/interviewFileController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const interviewFileRouter = express_1.default.Router();
interviewFileRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin', 'Employee']), interviewFileController_1.default.create);
interviewFileRouter.delete('/:interviewFileId/interview/:InterviewId', (0, checkAuth_1.checkAuth)(['Admin', 'Employee']), interviewFileController_1.default.delete);
interviewFileRouter.get('/interview/:interviewId', interviewFileController_1.default.getAll);
exports.default = interviewFileRouter;
