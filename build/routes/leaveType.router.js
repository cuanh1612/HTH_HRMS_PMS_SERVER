"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveType_controller_1 = __importDefault(require("../controllers/leaveType.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const leaveTypeRouter = express_1.default.Router();
leaveTypeRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), leaveType_controller_1.default.create);
leaveTypeRouter.get('/', leaveType_controller_1.default.getAll);
exports.default = leaveTypeRouter;
