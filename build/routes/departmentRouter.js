"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const departmentController_1 = __importDefault(require("../controllers/departmentController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const departmentRouter = express_1.default.Router();
departmentRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), departmentController_1.default.create);
departmentRouter.put('/:id', (0, checkAuth_1.checkAuth)(['Admin']), departmentController_1.default.update);
departmentRouter.get('/', departmentController_1.default.getAll);
departmentRouter.get('/:id', departmentController_1.default.getDetail);
departmentRouter.delete('/:id', (0, checkAuth_1.checkAuth)(['Admin']), departmentController_1.default.delete);
exports.default = departmentRouter;
