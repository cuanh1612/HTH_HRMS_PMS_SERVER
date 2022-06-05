"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const timeLogController_1 = __importDefault(require("../controllers/timeLogController"));
const TimeLogRouter = express_1.default.Router();
TimeLogRouter.post('/delete-many', timeLogController_1.default.Deletemany);
TimeLogRouter.get('/calendar', timeLogController_1.default.calendar);
TimeLogRouter.get('/calendar-employee/:employeeId', timeLogController_1.default.calendarByEmployee);
TimeLogRouter.post('/', timeLogController_1.default.create);
TimeLogRouter.get('/current-user', timeLogController_1.default.getByCurrentUser);
TimeLogRouter.get('/by-project/:projectId', timeLogController_1.default.getAllByProject);
TimeLogRouter.get('/:timelogId', timeLogController_1.default.getDetail);
TimeLogRouter.get('/', timeLogController_1.default.getAll);
TimeLogRouter.delete('/:timeLogId', timeLogController_1.default.delete);
TimeLogRouter.put('/:timeLogId', timeLogController_1.default.update);
exports.default = TimeLogRouter;
