"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discussion_controller_1 = __importDefault(require("../controllers/discussion.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const discussionRouter = express_1.default.Router();
discussionRouter.post('/', (0, checkAuth_1.checkAuth)([]), discussion_controller_1.default.create);
discussionRouter.get('/contract/:contractId', (0, checkAuth_1.checkAuth)([]), discussion_controller_1.default.getByContract);
discussionRouter.delete('/:discussionId', (0, checkAuth_1.checkAuth)([]), discussion_controller_1.default.delete);
discussionRouter.put('/:discussionId', (0, checkAuth_1.checkAuth)([]), discussion_controller_1.default.update);
exports.default = discussionRouter;
