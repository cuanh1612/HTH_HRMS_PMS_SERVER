"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = __importDefault(require("../controllers/notificationController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const NotificationRouter = express_1.default.Router();
NotificationRouter.post('/', (0, checkAuth_1.checkAuth)([]), notificationController_1.default.create);
NotificationRouter.get('/', (0, checkAuth_1.checkAuth)([]), notificationController_1.default.getAllByCurrentUser);
NotificationRouter.delete('/:notificationId', (0, checkAuth_1.checkAuth)([]), notificationController_1.default.delete);
exports.default = NotificationRouter;
