"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectDiscussionReplyController_1 = __importDefault(require("../controllers/projectDiscussionReplyController"));
const projectDiscussionReplyRouter = express_1.default.Router();
projectDiscussionReplyRouter.post('/', projectDiscussionReplyController_1.default.create);
projectDiscussionReplyRouter.get('/project-discussion-room/:projectDiscussionRoomId', projectDiscussionReplyController_1.default.getByProjectDiscussionRoom);
projectDiscussionReplyRouter.delete('/:reply_id', projectDiscussionReplyController_1.default.delete);
projectDiscussionReplyRouter.put('/:reply_id', projectDiscussionReplyController_1.default.update);
exports.default = projectDiscussionReplyRouter;
