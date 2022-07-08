"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobApplicationFileController_1 = __importDefault(require("../controllers/jobApplicationFileController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const jobApplicationFileRouter = express_1.default.Router();
jobApplicationFileRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin', 'Employee']), jobApplicationFileController_1.default.create);
jobApplicationFileRouter.delete('/:jobApplicationFileId/job-application/:jobApplicationId', (0, checkAuth_1.checkAuth)(['Admin', 'Employee']), jobApplicationFileController_1.default.delete);
jobApplicationFileRouter.get('/job-application/:jobApplicationId', jobApplicationFileController_1.default.getAll);
exports.default = jobApplicationFileRouter;
