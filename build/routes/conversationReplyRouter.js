"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversationReplyController_1 = __importDefault(require("../controllers/conversationReplyController"));
const conversationReplyRouter = express_1.default.Router();
conversationReplyRouter.post('/', conversationReplyController_1.default.create);
conversationReplyRouter.get('/conversation/:conversationId', conversationReplyController_1.default.getByConversation);
exports.default = conversationReplyRouter;
