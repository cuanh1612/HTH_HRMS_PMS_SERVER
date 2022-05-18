"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectDiscussionRoomController_1 = __importDefault(require("../controllers/projectDiscussionRoomController"));
const projectDiscussionRoomRouter = express_1.default.Router();
projectDiscussionRoomRouter.post('/', projectDiscussionRoomController_1.default.create);
projectDiscussionRoomRouter.get('/:id', projectDiscussionRoomController_1.default.getDetail);
projectDiscussionRoomRouter.get('/project/:project_id', projectDiscussionRoomController_1.default.getByProject);
projectDiscussionRoomRouter.delete('/:id', projectDiscussionRoomController_1.default.Delete);
exports.default = projectDiscussionRoomRouter;
