"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskCategory_controller_1 = __importDefault(require("../controllers/taskCategory.controller"));
const taskCategoryRouter = express_1.default.Router();
taskCategoryRouter.post('/', taskCategory_controller_1.default.create);
taskCategoryRouter.put('/:id', taskCategory_controller_1.default.update);
taskCategoryRouter.get('/', taskCategory_controller_1.default.getAll);
taskCategoryRouter.get('/:id', taskCategory_controller_1.default.getDetail);
taskCategoryRouter.delete('/:id', taskCategory_controller_1.default.delete);
exports.default = taskCategoryRouter;
