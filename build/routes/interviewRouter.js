"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interviewController_1 = __importDefault(require("../controllers/interviewController"));
const interviewRouter = express_1.default.Router();
interviewRouter.post('/', interviewController_1.default.create);
interviewRouter.delete('/:id', interviewController_1.default.delete);
interviewRouter.post('/delete-many', interviewController_1.default.deleteMany);
interviewRouter.get('/', interviewController_1.default.getAll);
interviewRouter.get('/:id', interviewController_1.default.getDetail);
interviewRouter.put('/status/:id', interviewController_1.default.updateStatus);
interviewRouter.put('/:id', interviewController_1.default.update);
interviewRouter.get('/job/:jobId', interviewController_1.default.getByJob);
exports.default = interviewRouter;
