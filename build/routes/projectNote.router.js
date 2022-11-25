"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectNote_controller_1 = __importDefault(require("../controllers/projectNote.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
//Check auth in controller
const projectNoteRouter = express_1.default.Router();
projectNoteRouter.post('/', (0, checkAuth_1.checkAuth)([]), projectNote_controller_1.default.create);
projectNoteRouter.put('/:projectNoteId', projectNote_controller_1.default.update);
projectNoteRouter.delete('/:projectNoteId', projectNote_controller_1.default.delete);
projectNoteRouter.post('/delete-many', projectNote_controller_1.default.deleteMany);
projectNoteRouter.get('/project/:projectId', projectNote_controller_1.default.getByProject);
projectNoteRouter.get('/:projectNoteId', projectNote_controller_1.default.getDetail);
exports.default = projectNoteRouter;
