"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectFile_controller_1 = __importDefault(require("../controllers/projectFile.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const projectFileRouter = express_1.default.Router();
projectFileRouter.post('/', (0, checkAuth_1.checkAuth)([]), projectFile_controller_1.default.create);
projectFileRouter.delete('/:projectFileId/project/:projectId', (0, checkAuth_1.checkAuth)([]), projectFile_controller_1.default.delete);
projectFileRouter.get('/project/:projectId', (0, checkAuth_1.checkAuth)([]), projectFile_controller_1.default.getAll);
exports.default = projectFileRouter;
