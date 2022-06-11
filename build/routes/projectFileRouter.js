"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectFileController_1 = __importDefault(require("../controllers/projectFileController"));
const projectFileRouter = express_1.default.Router();
projectFileRouter.post('/', projectFileController_1.default.create);
projectFileRouter.delete('/:projectFileId/project/:projectId', projectFileController_1.default.delete);
projectFileRouter.get('/project/:projectId', projectFileController_1.default.getAll);
exports.default = projectFileRouter;
