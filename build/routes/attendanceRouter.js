"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = __importDefault(require("../controllers/attendanceController"));
const attendanceRouter = express_1.default.Router();
attendanceRouter.get('/', attendanceController_1.default.getAll);
attendanceRouter.post('/', attendanceController_1.default.create);
attendanceRouter.put('/:id', attendanceController_1.default.update);
attendanceRouter.get('/:id', attendanceController_1.default.getDetail);
attendanceRouter.delete('/:id', attendanceController_1.default.delete);
exports.default = attendanceRouter;
