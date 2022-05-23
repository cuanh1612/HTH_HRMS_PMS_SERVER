"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = __importDefault(require("../controllers/projectController"));
const projectRouter = express_1.default.Router();
projectRouter.post('/delete-employee', projectController_1.default.deleteEmployee);
projectRouter.post('/', projectController_1.default.create);
projectRouter.get('/all-employees/:idProject', projectController_1.default.allEmployees);
projectRouter.get('/:projectId/check-asigned', projectController_1.default.checkAssigned);
projectRouter.put('/:id', projectController_1.default.update);
projectRouter.get('/', projectController_1.default.getAll);
projectRouter.get('/:id', projectController_1.default.getDetail);
projectRouter.delete('/:id', projectController_1.default.delete);
projectRouter.post('/delete-many', projectController_1.default.deletemany);
projectRouter.post('/project-admin', projectController_1.default.setProjectAdmin);
exports.default = projectRouter;
