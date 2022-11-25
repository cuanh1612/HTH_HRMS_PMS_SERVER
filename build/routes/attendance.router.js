"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendance_controller_1 = __importDefault(require("../controllers/attendance.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const attendanceRouter = express_1.default.Router();
attendanceRouter.get('/', attendance_controller_1.default.getAll);
attendanceRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), attendance_controller_1.default.insertOne);
attendanceRouter.put('/:id', (0, checkAuth_1.checkAuth)(['Admin']), attendance_controller_1.default.update);
attendanceRouter.get('/:id', attendance_controller_1.default.getDetail);
attendanceRouter.delete('/:id', (0, checkAuth_1.checkAuth)(['Admin']), attendance_controller_1.default.delete);
exports.default = attendanceRouter;
