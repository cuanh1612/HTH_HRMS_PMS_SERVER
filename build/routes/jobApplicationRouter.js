"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobApplicationController_1 = __importDefault(require("../controllers/jobApplicationController"));
const jobApplicationRouter = express_1.default.Router();
jobApplicationRouter.post('/', jobApplicationController_1.default.create);
jobApplicationRouter.delete('/:id', jobApplicationController_1.default.delete);
jobApplicationRouter.post('/delete-many', jobApplicationController_1.default.deleteMany);
jobApplicationRouter.get('/', jobApplicationController_1.default.getAll);
jobApplicationRouter.get('/:id', jobApplicationController_1.default.getDetail);
jobApplicationRouter.get('/job/:JobId', jobApplicationController_1.default.getByJob);
jobApplicationRouter.put('/:id', jobApplicationController_1.default.update);
jobApplicationRouter.put('/change-status', jobApplicationController_1.default.changeStatusMany);
jobApplicationRouter.put('/status/:id', jobApplicationController_1.default.updateStatus);
jobApplicationRouter.post('/change-skills', jobApplicationController_1.default.changeSkills);
exports.default = jobApplicationRouter;
