"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = __importDefault(require("../controllers/taskController"));
const taskRouter = express_1.default.Router();
taskRouter.post('/', taskController_1.default.create);
taskRouter.get('/', taskController_1.default.getAll);
taskRouter.get('/:id', taskController_1.default.getDetail);
taskRouter.delete('/:id', taskController_1.default.delete);
taskRouter.post('/delete-many', taskController_1.default.deletemany);
taskRouter.put('/:id', taskController_1.default.update);
exports.default = taskRouter;
