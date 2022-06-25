"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskFileController_1 = __importDefault(require("../controllers/taskFileController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const taskFileRouter = express_1.default.Router();
taskFileRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin', 'Employee']), taskFileController_1.default.create);
taskFileRouter.delete('/:taskFileId/task/:taskId', (0, checkAuth_1.checkAuth)(['Admin', 'Employee']), taskFileController_1.default.delete);
taskFileRouter.get('/task/:taskId', taskFileController_1.default.getAll);
exports.default = taskFileRouter;
