"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectActivity_controller_1 = __importDefault(require("../controllers/projectActivity.controller"));
const projectActivityRouter = express_1.default.Router();
projectActivityRouter.get('/:projectId', projectActivity_controller_1.default.getByProject);
exports.default = projectActivityRouter;
