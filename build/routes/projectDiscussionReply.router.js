"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectDiscussionReply_controller_1 = __importDefault(require("../controllers/projectDiscussionReply.controller"));
const projectDiscussionReplyRouter = express_1.default.Router();
projectDiscussionReplyRouter.post('/', projectDiscussionReply_controller_1.default.create);
projectDiscussionReplyRouter.get('/project-discussion-room/:projectDiscussionRoomId', projectDiscussionReply_controller_1.default.getByProjectDiscussionRoom);
projectDiscussionReplyRouter.get('/:reply_id', projectDiscussionReply_controller_1.default.getDetail);
projectDiscussionReplyRouter.delete('/:reply_id', projectDiscussionReply_controller_1.default.delete);
projectDiscussionReplyRouter.put('/:reply_id', projectDiscussionReply_controller_1.default.update);
exports.default = projectDiscussionReplyRouter;
