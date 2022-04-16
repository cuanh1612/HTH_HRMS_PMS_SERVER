"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discussionController_1 = __importDefault(require("../controllers/discussionController"));
const discussionRouter = express_1.default.Router();
discussionRouter.post('/', discussionController_1.default.create);
discussionRouter.get('/contract/:contractId', discussionController_1.default.getByContract);
discussionRouter.delete('/:discussionId', discussionController_1.default.delele);
discussionRouter.put('/:discussionId', discussionController_1.default.update);
exports.default = discussionRouter;
