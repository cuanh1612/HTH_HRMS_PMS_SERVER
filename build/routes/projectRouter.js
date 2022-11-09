"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_controller_1 = __importDefault(require("../controllers/project.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const projectRouter = express_1.default.Router();
projectRouter.post('/delete-employee', (0, checkAuth_1.checkAuth)([]), project_controller_1.default.deleteEmployee);
projectRouter.post('/', (0, checkAuth_1.checkAuth)([]), project_controller_1.default.create);
projectRouter.put('/assign-employee/:projectId', (0, checkAuth_1.checkAuth)([]), project_controller_1.default.assignEmployee);
projectRouter.put('/assign-employee/department/:projectId', (0, checkAuth_1.checkAuth)([]), project_controller_1.default.assignEmployeeByDepartment);
projectRouter.put('/:id', (0, checkAuth_1.checkAuth)([]), project_controller_1.default.update);
projectRouter.get('/:projectId/change-status', (0, checkAuth_1.checkAuth)([]), project_controller_1.default.changeStatus);
projectRouter.get('/', (0, checkAuth_1.checkAuth)([]), project_controller_1.default.getAll);
projectRouter.get('/current-user', (0, checkAuth_1.checkAuth)([]), project_controller_1.default.getAllByCurrentUser);
projectRouter.get('/normal', project_controller_1.default.getAllNormal);
projectRouter.get('/:id', project_controller_1.default.getDetail);
projectRouter.get('/normal/employee/:employeeId', (0, checkAuth_1.checkAuth)(['Admin', 'Employee']), project_controller_1.default.getAllNormalByEmployee);
projectRouter.get('/get-employees-not-in-project/:projectId', (0, checkAuth_1.checkAuth)([]), project_controller_1.default.getEmployeeNotIn);
projectRouter.get('/all-employees/:idProject', (0, checkAuth_1.checkAuth)([]), project_controller_1.default.allEmployees);
projectRouter.get('/:projectId/check-assigned', (0, checkAuth_1.checkAuth)([]), project_controller_1.default.checkAssigned);
projectRouter.get('/:projectId/count-status-tasks', (0, checkAuth_1.checkAuth)(['Admin']), project_controller_1.default.countstatusTasks);
projectRouter.get('/:projectId/earnings', (0, checkAuth_1.checkAuth)(['Admin']), project_controller_1.default.projectEarnings);
projectRouter.get('/:projectId/Hours-logged', (0, checkAuth_1.checkAuth)(['Admin']), project_controller_1.default.projectHoursLogged);
projectRouter.get('/client/:clientId/project-status', (0, checkAuth_1.checkAuth)(['Admin', 'Client']), project_controller_1.default.projectStatusByClient);
projectRouter.delete('/:id', (0, checkAuth_1.checkAuth)(['Admin']), project_controller_1.default.delete);
projectRouter.post('/delete-many', (0, checkAuth_1.checkAuth)(['Admin']), project_controller_1.default.deleteMany);
projectRouter.post('/project-admin', (0, checkAuth_1.checkAuth)(['Admin']), project_controller_1.default.setProjectAdmin);
exports.default = projectRouter;
