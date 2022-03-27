"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = __importDefault(require("../controllers/employeeController"));
const userRouter = express_1.default.Router();
userRouter.post('/', employeeController_1.default.create);
userRouter.put('/role', employeeController_1.default.changeRole);
userRouter.put('/:employeeId', employeeController_1.default.update);
userRouter.get('/', employeeController_1.default.getAll);
userRouter.get('/:employeeId', employeeController_1.default.getDetail);
userRouter.delete('/:employeeId', employeeController_1.default.delete);
exports.default = userRouter;
