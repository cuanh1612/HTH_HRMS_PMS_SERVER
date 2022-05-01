"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = __importDefault(require("../controllers/projectController"));
const projectRouter = express_1.default.Router();
projectRouter.post('/', projectController_1.default.create);
projectRouter.put('/:id', projectController_1.default.update);
projectRouter.get('/', projectController_1.default.getAll);
projectRouter.get('/:id', projectController_1.default.getDetail);
projectRouter.delete('/:id', projectController_1.default.delete);
projectRouter.delete('/delete-many', projectController_1.default.deletemany);
exports.default = projectRouter;
