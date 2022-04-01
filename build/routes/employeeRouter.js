"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = __importDefault(require("../controllers/employeeController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const userRouter = express_1.default.Router();
userRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), employeeController_1.default.create);
userRouter.post('/delete_may', (0, checkAuth_1.checkAuth)(['Admin']), employeeController_1.default.deleteMany);
userRouter.put('/role', (0, checkAuth_1.checkAuth)(['Admin']), employeeController_1.default.changeRole);
userRouter.put('/:employeeId', (0, checkAuth_1.checkAuth)(['Admin']), employeeController_1.default.update);
userRouter.get('/', (0, checkAuth_1.checkAuth)([]), employeeController_1.default.getAll);
userRouter.get('/:employeeId', (0, checkAuth_1.checkAuth)([]), employeeController_1.default.getDetail);
userRouter.delete('/:employeeId', (0, checkAuth_1.checkAuth)(['Admin']), employeeController_1.default.delete);
exports.default = userRouter;
