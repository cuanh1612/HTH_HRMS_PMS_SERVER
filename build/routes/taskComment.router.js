"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskComment_controller_1 = __importDefault(require("../controllers/taskComment.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const taskCommentRouter = express_1.default.Router();
taskCommentRouter.post('/', (0, checkAuth_1.checkAuth)([]), taskComment_controller_1.default.create);
taskCommentRouter.get('/task/:taskId', (0, checkAuth_1.checkAuth)([]), taskComment_controller_1.default.getByTask);
taskCommentRouter.delete('/:taskCommentId', (0, checkAuth_1.checkAuth)([]), taskComment_controller_1.default.delete);
taskCommentRouter.put('/:taskCommentId', (0, checkAuth_1.checkAuth)([]), taskComment_controller_1.default.update);
exports.default = taskCommentRouter;
