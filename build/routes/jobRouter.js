"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const job_controller_1 = __importDefault(require("../controllers/job.controller"));
const jobRouter = express_1.default.Router();
jobRouter.post('/', job_controller_1.default.create);
jobRouter.delete('/:id', job_controller_1.default.delete);
jobRouter.post('/delete-many', job_controller_1.default.deleteMany);
jobRouter.get('/', job_controller_1.default.getAll);
jobRouter.get('/:id', job_controller_1.default.getDetail);
jobRouter.put('/status/:id', job_controller_1.default.updateStatus);
jobRouter.put('/:id', job_controller_1.default.update);
jobRouter.put('/change-status', job_controller_1.default.changeStatusMany);
exports.default = jobRouter;
