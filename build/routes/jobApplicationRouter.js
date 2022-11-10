"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobApplication_controller_1 = __importDefault(require("../controllers/jobApplication.controller"));
const jobApplicationRouter = express_1.default.Router();
jobApplicationRouter.post('/', jobApplication_controller_1.default.create);
jobApplicationRouter.delete('/:id', jobApplication_controller_1.default.delete);
jobApplicationRouter.post('/delete-many', jobApplication_controller_1.default.deleteMany);
jobApplicationRouter.get('/', jobApplication_controller_1.default.getAll);
jobApplicationRouter.get('/:id', jobApplication_controller_1.default.getDetail);
jobApplicationRouter.get('/job/:JobId', jobApplication_controller_1.default.getByJob);
jobApplicationRouter.put('/:id', jobApplication_controller_1.default.update);
jobApplicationRouter.put('/change-status', jobApplication_controller_1.default.changeStatusMany);
jobApplicationRouter.put('/status/:id', jobApplication_controller_1.default.updateStatus);
jobApplicationRouter.post('/change-skills', jobApplication_controller_1.default.changeSkills);
exports.default = jobApplicationRouter;
