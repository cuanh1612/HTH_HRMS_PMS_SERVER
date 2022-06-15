"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskCategoryController_1 = __importDefault(require("../controllers/taskCategoryController"));
const taskCategoryRouter = express_1.default.Router();
taskCategoryRouter.post('/', taskCategoryController_1.default.create);
taskCategoryRouter.put('/:id', taskCategoryController_1.default.update);
taskCategoryRouter.get('/', taskCategoryController_1.default.getAll);
taskCategoryRouter.get('/:id', taskCategoryController_1.default.getDetail);
taskCategoryRouter.delete('/:id', taskCategoryController_1.default.delete);
exports.default = taskCategoryRouter;
