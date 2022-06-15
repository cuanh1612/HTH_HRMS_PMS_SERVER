"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveTypeController_1 = __importDefault(require("../controllers/leaveTypeController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const leaveTypeRouter = express_1.default.Router();
leaveTypeRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), leaveTypeController_1.default.create);
leaveTypeRouter.get('/', leaveTypeController_1.default.getAll);
exports.default = leaveTypeRouter;
