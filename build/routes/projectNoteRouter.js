"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectNoteController_1 = __importDefault(require("../controllers/projectNoteController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const projectNoteRouter = express_1.default.Router();
projectNoteRouter.post('/', (0, checkAuth_1.checkAuth)([]), projectNoteController_1.default.create);
projectNoteRouter.put('/:projectNoteId', projectNoteController_1.default.update);
projectNoteRouter.delete('/:projectNoteId', projectNoteController_1.default.delete);
projectNoteRouter.post('/delete-many', projectNoteController_1.default.deleteMany);
projectNoteRouter.get('/project/:projectId', projectNoteController_1.default.getByProject);
projectNoteRouter.get('/:projectNoteId', projectNoteController_1.default.getDetail);
exports.default = projectNoteRouter;
