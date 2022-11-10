"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectDiscussionRoom_controller_1 = __importDefault(require("../controllers/projectDiscussionRoom.controller"));
const projectDiscussionRoomRouter = express_1.default.Router();
projectDiscussionRoomRouter.post('/', projectDiscussionRoom_controller_1.default.create);
projectDiscussionRoomRouter.get('/:id', projectDiscussionRoom_controller_1.default.getDetail);
projectDiscussionRoomRouter.get('/project/:project_id', projectDiscussionRoom_controller_1.default.getByProject);
projectDiscussionRoomRouter.delete('/:id', projectDiscussionRoom_controller_1.default.Delete);
exports.default = projectDiscussionRoomRouter;
