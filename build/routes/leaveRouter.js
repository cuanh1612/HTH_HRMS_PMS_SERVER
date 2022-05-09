"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveController_1 = __importDefault(require("../controllers/leaveController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const leaveRouter = express_1.default.Router();
leaveRouter.post('/', leaveController_1.default.create);
leaveRouter.post('/delete-many', leaveController_1.default.deleteMany);
leaveRouter.get('/', leaveController_1.default.getAll);
leaveRouter.get('/:leaveId', leaveController_1.default.getDetail);
leaveRouter.delete('/:leaveId', (0, checkAuth_1.checkAuth)(['Admin']), leaveController_1.default.delete);
leaveRouter.put('/:leaveId', (0, checkAuth_1.checkAuth)(['Admin']), leaveController_1.default.update);
leaveRouter.put('/status/:leaveId', leaveController_1.default.updateStatus);
exports.default = leaveRouter;
