"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectActivityController_1 = __importDefault(require("../controllers/projectActivityController"));
const projectActivityRouter = express_1.default.Router();
projectActivityRouter.get('/:projectId', projectActivityController_1.default.getByProject);
exports.default = projectActivityRouter;
