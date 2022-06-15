"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectCategoryController_1 = __importDefault(require("../controllers/projectCategoryController"));
const projectCategoryRouter = express_1.default.Router();
projectCategoryRouter.post('/', projectCategoryController_1.default.create);
projectCategoryRouter.put('/:id', projectCategoryController_1.default.update);
projectCategoryRouter.get('/', projectCategoryController_1.default.getAll);
projectCategoryRouter.get('/:id', projectCategoryController_1.default.getDetail);
projectCategoryRouter.delete('/:id', projectCategoryController_1.default.delete);
exports.default = projectCategoryRouter;
