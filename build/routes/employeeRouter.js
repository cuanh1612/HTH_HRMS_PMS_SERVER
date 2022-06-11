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
userRouter.post('/delete-many', (0, checkAuth_1.checkAuth)(['Admin']), employeeController_1.default.deleteMany);
userRouter.put('/role', (0, checkAuth_1.checkAuth)(['Admin']), employeeController_1.default.changeRole);
userRouter.put('/:employeeId', (0, checkAuth_1.checkAuth)([]), employeeController_1.default.update);
userRouter.get('/normal', employeeController_1.default.getNormal);
userRouter.get('/', (0, checkAuth_1.checkAuth)([]), employeeController_1.default.getAll);
userRouter.get('/:employeeId', (0, checkAuth_1.checkAuth)([]), employeeController_1.default.getDetail);
userRouter.get('/:employeeId/open-tasks', (0, checkAuth_1.checkAuth)([]), employeeController_1.default.getOpenTasks);
userRouter.get('/:employeeId/hours-logged', (0, checkAuth_1.checkAuth)([]), employeeController_1.default.getHoursLogged);
userRouter.get('/:employeeId/count-projects', (0, checkAuth_1.checkAuth)([]), employeeController_1.default.getCountProjects);
userRouter.get('/:employeeId/late-attendance', (0, checkAuth_1.checkAuth)([]), employeeController_1.default.getLateAttendance);
userRouter.get('/:employeeId/count-leaves-taken', (0, checkAuth_1.checkAuth)([]), employeeController_1.default.countLeavesTaken);
userRouter.get('/:employeeId/count-tasks-status', (0, checkAuth_1.checkAuth)([]), employeeController_1.default.countTasksStatus);
userRouter.get('/:employeeId/tasks', (0, checkAuth_1.checkAuth)([]), employeeController_1.default.getTasks);
// userRouter.get('/:employeeId/count-pending-tasks', checkAuth([]), employeeController.getCountPendingTasks)
// userRouter.get('/:employeeId/getCountOverdueTasks', employeeController.getCountOverdueTasks)
userRouter.delete('/:employeeId', (0, checkAuth_1.checkAuth)(['Admin']), employeeController_1.default.delete);
exports.default = userRouter;
