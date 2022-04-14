"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversationController_1 = __importDefault(require("../controllers/conversationController"));
const conversationRouter = express_1.default.Router();
conversationRouter.post('/', conversationController_1.default.create);
conversationRouter.get('/user/:userId', conversationController_1.default.getByUser);
exports.default = conversationRouter;
