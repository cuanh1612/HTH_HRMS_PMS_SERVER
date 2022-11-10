"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leave_controller_1 = __importDefault(require("../controllers/leave.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const leaveRouter = express_1.default.Router();
leaveRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin', 'Employee']), leave_controller_1.default.create);
leaveRouter.post('/delete-many', (0, checkAuth_1.checkAuth)(['Admin', 'Employee']), leave_controller_1.default.deleteMany);
leaveRouter.get('/', leave_controller_1.default.getAll);
leaveRouter.get('/:leaveId', leave_controller_1.default.getDetail);
leaveRouter.delete('/:leaveId', (0, checkAuth_1.checkAuth)(['Admin', 'Employee']), leave_controller_1.default.delete);
leaveRouter.put('/:leaveId', (0, checkAuth_1.checkAuth)(['Admin']), leave_controller_1.default.update);
leaveRouter.put('/status/:leaveId', (0, checkAuth_1.checkAuth)(['Admin', 'Employee']), leave_controller_1.default.updateStatus);
exports.default = leaveRouter;
