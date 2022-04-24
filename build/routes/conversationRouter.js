"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversationController_1 = __importDefault(require("../controllers/conversationController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const conversationRouter = express_1.default.Router();
conversationRouter.post('/', (0, checkAuth_1.checkAuth)([]), conversationController_1.default.create);
conversationRouter.get('/user/:userId', (0, checkAuth_1.checkAuth)([]), conversationController_1.default.getByUser);
conversationRouter.delete('/:conversationId/user/:userId', (0, checkAuth_1.checkAuth)([]), conversationController_1.default.delete);
exports.default = conversationRouter;
