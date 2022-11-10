"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salary_controller_1 = __importDefault(require("../controllers/salary.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const salaryRouter = express_1.default.Router();
salaryRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), salary_controller_1.default.create);
salaryRouter.get('/', (0, checkAuth_1.checkAuth)([]), salary_controller_1.default.getAll);
salaryRouter.get('/employee/:employeeId', (0, checkAuth_1.checkAuth)([]), salary_controller_1.default.getHistoryByUser);
salaryRouter.delete('/:salaryId', (0, checkAuth_1.checkAuth)(['Admin']), salary_controller_1.default.delete);
exports.default = salaryRouter;
