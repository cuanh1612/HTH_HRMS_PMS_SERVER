"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salaryController_1 = __importDefault(require("../controllers/salaryController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const salaryRouter = express_1.default.Router();
salaryRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), salaryController_1.default.create);
salaryRouter.get('/', (0, checkAuth_1.checkAuth)([]), salaryController_1.default.getAll);
salaryRouter.get('/employee/:employeeId', (0, checkAuth_1.checkAuth)([]), salaryController_1.default.getHistoryByUser);
salaryRouter.delete('/:salaryId', (0, checkAuth_1.checkAuth)(['Admin']), salaryController_1.default.delete);
exports.default = salaryRouter;
