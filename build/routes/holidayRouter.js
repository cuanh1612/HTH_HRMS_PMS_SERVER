"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const holiday_controller_1 = __importDefault(require("../controllers/holiday.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const holidayRouter = express_1.default.Router();
holidayRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), holiday_controller_1.default.create);
holidayRouter.put('/:id', (0, checkAuth_1.checkAuth)(['Admin']), holiday_controller_1.default.update);
holidayRouter.get('/', holiday_controller_1.default.getAll);
holidayRouter.get('/:id', holiday_controller_1.default.getDetail);
holidayRouter.delete('/:id', (0, checkAuth_1.checkAuth)(['Admin']), holiday_controller_1.default.delete);
holidayRouter.post('/delete-many', (0, checkAuth_1.checkAuth)(['Admin']), holiday_controller_1.default.deleteMany);
exports.default = holidayRouter;
